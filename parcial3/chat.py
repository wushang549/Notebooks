from openai import OpenAI
import os
from dotenv import load_dotenv

SYSTEM_MESSAGE = "You are a chatbot. You will have a conversation with a user. Be friendly and concise"
EXIT_COMMANDS = {"exit", "quit", "salir"}


def get_env(*names):
    for name in names:
        value = os.environ.get(name)
        if value:
            return value
    return None

if __name__ == "__main__":
    load_dotenv()
    URL = os.environ.get("OPENAI_BASE_URL")
    KEY = get_env("OPENAI_API_KEY", "OPENAI_KEY")
    MODEL = get_env("OPENAI_TEXT_MODEL", "MODEL")

    if not KEY:
        raise ValueError("Missing OPENAI_API_KEY in your .env file")

    if not MODEL:
        raise ValueError("Missing OPENAI_TEXT_MODEL in your .env file")

    client_options = {"api_key": KEY}

    if URL:
        client_options["base_url"] = URL

    client = OpenAI(**client_options)
    messages = [{"role": "system", "content": SYSTEM_MESSAGE}]

    print(f"Chatting with {MODEL} model")
    print("Type 'salir', 'exit', or 'quit' to end the conversation.\n")

    while True:
        message = input("> ")

        if message.lower() in EXIT_COMMANDS:
            break

        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
        )
        assistant_message = response.choices[0].message
        messages.append(assistant_message)

        print(assistant_message.content)
