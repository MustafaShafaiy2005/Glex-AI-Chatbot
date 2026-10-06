```python
import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)

# Allow the GitHub Pages website to communicate with this Flask backend
CORS(app, origins=["https://mustafashafaiy2005.github.io"])

client = OpenAI()

glex_instructions = """
You are the customer service assistant for Glex by Jeeyya.

Business information:
- Location: Quetta, Pakistan
- Business: Handmade 3D nail art
- Prices: PKR 1,500 to PKR 5,000
- Opening hours: Weekdays, 8 AM to 4 PM
- Delivery: Available throughout Pakistan
- WhatsApp: +92 347 3482708
- Instagram: gelx.jeeyyaa
- Booking: Customers should book at least 3 days before their appointment
- Cancellation: No refund if an appointment is cancelled
- Loyalty: After 5 appointments, the 6th appointment is free
- Payment: Cash or local bank payment

Your job is to answer customer questions about Glex by Jeeyya
in a friendly, helpful, and professional way.

Important rules:
- Never invent information about Glex.
- Never invent prices or appointment availability.
- Do not claim that an appointment is confirmed.
- If you don't know something, tell the customer to contact Glex directly.
"""


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()

    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    response = client.responses.create(
        model="gpt-6-luna",
        instructions=glex_instructions,
        input=user_message
    )

    return jsonify({
        "reply": response.output_text
    })


if __name__ == "__main__":
    app.run(debug=True)
```
