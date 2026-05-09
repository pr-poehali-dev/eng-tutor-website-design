import os
import requests

TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
BASE = f"https://api.telegram.org/bot{TOKEN}"


def call(method, **kwargs):
    r = requests.post(f"{BASE}/{method}", json=kwargs, timeout=15)
    return r.json()


def send_message(chat_id, text, reply_markup=None, parse_mode="HTML"):
    params = {"chat_id": chat_id, "text": text, "parse_mode": parse_mode}
    if reply_markup:
        params["reply_markup"] = reply_markup
    return call("sendMessage", **params)


def send_photo(chat_id, photo, caption=None, reply_markup=None, parse_mode="HTML"):
    params = {"chat_id": chat_id, "photo": photo, "parse_mode": parse_mode}
    if caption:
        params["caption"] = caption
    if reply_markup:
        params["reply_markup"] = reply_markup
    return call("sendPhoto", **params)


def edit_message_text(chat_id, message_id, text, reply_markup=None, parse_mode="HTML"):
    params = {"chat_id": chat_id, "message_id": message_id, "text": text, "parse_mode": parse_mode}
    if reply_markup:
        params["reply_markup"] = reply_markup
    return call("editMessageText", **params)


def edit_message_reply_markup(chat_id, message_id, reply_markup):
    return call("editMessageReplyMarkup", chat_id=chat_id, message_id=message_id, reply_markup=reply_markup)


def answer_callback_query(callback_query_id, text="", show_alert=False):
    return call("answerCallbackQuery", callback_query_id=callback_query_id, text=text, show_alert=show_alert)


def delete_message(chat_id, message_id):
    return call("deleteMessage", chat_id=chat_id, message_id=message_id)


def set_webhook(url):
    return call("setWebhook", url=url)
