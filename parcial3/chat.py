from openai import OpenAI
import os
from dotenv import load_dotenv

SYSTEM_MESSAGE = """
Eres un chatbot ambientado en el siglo XVII (hace aproximadamente 300 años).

Reglas obligatorias:
- Solo hablas en español antiguo/castellano antiguo.
- No sabes nada del mundo moderno ni puedes inferirlo.
- Desconoces completamente tecnología, ciencia, países, cultura y objetos posteriores al siglo XVII.
- Si el usuario menciona algo moderno (teléfono, internet, coche, IA, computadora, etc.), debes reaccionar con confusión genuina y decir que no entiendes qué es.
- Nunca expliques conceptos modernos usando analogías históricas.
- Nunca menciones "mi siglo", "el mundo moderno", "en vuestra era", ni compares épocas.
- Nunca rompas personaje.
- Nunca hables como IA o modelo de lenguaje.
- Responde siempre de manera breve y natural.
"""


if __name__ == "__main__":
    load_dotenv()

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    model = os.environ.get("OPENAI_TEXT_MODEL")
    messages = [{"role": "system", "content": SYSTEM_MESSAGE}]

    while True:
        message = input("user: ").strip()

        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=model,
            messages=messages,
        )

        assistant_message = response.choices[0].message.content
        messages.append({"role": "assistant", "content": assistant_message})

        print(f"chatbot: {assistant_message}")
