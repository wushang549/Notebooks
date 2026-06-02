type Env = {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

type RewriteOptions = {
  tone?: string;
  intent?: string;
  language?: string;
  length?: string;
};

type RewritePayload = {
  message?: unknown;
  senderName?: unknown;
  options?: RewriteOptions;
};

type OpenAIContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  content?: OpenAIContent[];
};

type OpenAIResponseData = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["improvedMessage", "analysis", "changes"],
  properties: {
    improvedMessage: {
      type: "string",
      description: "The rewritten professional message.",
    },
    analysis: {
      type: "object",
      additionalProperties: false,
      required: [
        "detectedTone",
        "clarity",
        "professionalism",
        "toneRisk",
        "summary",
      ],
      properties: {
        detectedTone: {
          type: "string",
          description:
            "Describe only the tone present in the original rough message. Do not describe the rewritten message.",
        },
        clarity: {
          type: "string",
          description:
            "Assess only the clarity of the original rough message as written. Mention its writing issues, but do not mention corrections or improvements.",
        },
        professionalism: {
          type: "string",
          description:
            "Assess only the professionalism of the original rough message as written. Do not explain how it was improved.",
        },
        toneRisk: {
          type: "string",
          description:
            "Describe only the tone risk present in the original rough message. Do not describe risk after rewriting.",
        },
        summary: {
          type: "string",
          description:
            "Summarize only the original rough message and its main writing issues. Do not mention the rewrite or transformations.",
        },
      },
    },
    changes: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
  },
} as const;

const MAX_MESSAGE_LENGTH = 6000;

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getOutputText(responseData: OpenAIResponseData): string {
  if (typeof responseData.output_text === "string") {
    return responseData.output_text;
  }

  for (const item of responseData.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

function buildPrompt({
  message,
  senderName,
  options,
}: {
  message: string;
  senderName: string;
  options: RewriteOptions;
}): string {
  return `
Rewrite the user's rough message according to the selected preferences.

Original message:
${message}

Sender name:
${senderName || "Not provided"}

Selected preferences:
- Tone: ${options.tone || "Profesional"}
- Intent: ${options.intent || "Dar seguimiento"}
- Output language: ${options.language || "Mismo"}
- Length: ${options.length || "Normal"}

Rules:
- Preserve the user's core meaning.
- Make the rewritten message clear, professional, and natural.
- Adapt the message to the selected tone and intent.
- Format improvedMessage like a complete professional email/message:
  1. Greeting
  2. Main message body
  3. Courteous closing
  4. Signature only if sender name is provided
- If sender name is provided, end with an appropriate sign-off and that name.
- If sender name is not provided, include a courteous closing but do not invent a name.
- If output language is "Mismo", use the same language as the original message.
- If output language names a language, write the improved message in that language.
- Do not invent facts, dates, names, application status, or commitments.
- Analyze only the original rough message, never the rewritten improvedMessage.
- Be honest about spelling, grammar, clarity, incomplete ideas, and informal wording
  in the original message when those issues are present.
- Do not attribute a greeting, closing, formal structure, or improved wording to
  the original message unless it already contains them.
- In analysis, describe the original message as written. Never mention corrections,
  improvements, transformations, or the resulting rewritten message.
- Keep the analysis concise and useful for a professional writing assistant.
- Describe changes as transformations made from the original message to the
  rewritten message.
- Write analysis and changes in Spanish for this app UI.
`.trim();
}

export async function onRequestPost({
  request,
  env,
}: PagesContext): Promise<Response> {
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonResponse(
      { error: "OPENAI_API_KEY no esta configurada en el entorno." },
      500
    );
  }

  let payload: RewritePayload;

  try {
    payload = (await request.json()) as RewritePayload;
  } catch {
    return jsonResponse(
      { error: "El cuerpo de la solicitud no es JSON valido." },
      400
    );
  }

  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  const senderName =
    typeof payload.senderName === "string" ? payload.senderName.trim() : "";
  const options = payload.options ?? {};

  if (!message) {
    return jsonResponse({ error: "El mensaje original es obligatorio." }, 400);
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(
      { error: `El mensaje no puede superar ${MAX_MESSAGE_LENGTH} caracteres.` },
      400
    );
  }

  const model = env.OPENAI_MODEL || "gpt-5-nano";

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      reasoning: {
        effort: "minimal",
      },
      instructions:
        "You are Draftly, an AI writing assistant for professional communication. Return only valid JSON matching the requested schema. In analysis, evaluate only the original rough message as written. Mention rewrite improvements only in changes.",
      input: buildPrompt({ message, senderName, options }),
      text: {
        format: {
          type: "json_schema",
          name: "draftly_rewrite_result",
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
    }),
  });

  const data = (await openAiResponse.json()) as OpenAIResponseData;

  if (!openAiResponse.ok) {
    return jsonResponse(
      {
        error:
          data.error?.message ||
          "OpenAI no pudo generar una respuesta en este momento.",
      },
      openAiResponse.status
    );
  }

  try {
    return jsonResponse(JSON.parse(getOutputText(data)));
  } catch {
    return jsonResponse(
      { error: "La respuesta generada no tuvo el formato esperado." },
      502
    );
  }
}

export function onRequestGet(): Response {
  return jsonResponse({ status: "ok" });
}
