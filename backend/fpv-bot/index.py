"""
Webhook-обработчик Telegram-бота FPV Shop.
Принимает updates от Telegram и маршрутизирует по handlers.
"""
import json
import db
import bot_api as api
import handlers as h
import keyboards as kb


def handler(event: dict, context) -> dict:
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    # Setup webhook endpoint
    if event.get("httpMethod") == "GET":
        qs = event.get("queryStringParameters") or {}
        if qs.get("setup") == "1":
            import os
            func_url = qs.get("url", "")
            result = api.set_webhook(func_url)
            return {"statusCode": 200, "headers": cors, "body": json.dumps(result)}
        return {"statusCode": 200, "headers": cors, "body": "FPV Bot OK"}

    # Parse Telegram update
    try:
        update = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 200, "headers": cors, "body": "ok"}

    try:
        _dispatch(update)
    except Exception as e:
        print(f"Dispatch error: {e}")

    return {"statusCode": 200, "headers": cors, "body": "ok"}


def _dispatch(update: dict):
    # ── Callback query ────────────────────────────────────────────────────
    if "callback_query" in update:
        cq = update["callback_query"]
        chat_id = cq["message"]["chat"]["id"]
        cq_id = cq["id"]
        data = cq.get("data", "")

        _ensure_user(cq["from"])
        api.answer_callback_query(cq_id)

        if data.startswith("cat_back"):
            h.show_root_categories(chat_id)

        elif data.startswith("cat_"):
            cat_id = int(data.split("_")[1])
            h.show_subcategories_or_products(chat_id, cat_id)

        elif data.startswith("prodlist_"):
            cat_id = int(data.split("_")[1])
            h.show_products_list(chat_id, cat_id)

        elif data.startswith("prod_"):
            product_id = int(data.split("_")[1])
            h.show_product(chat_id, product_id)

        elif data.startswith("addcart_"):
            product_id = int(data.split("_")[1])
            h.add_to_cart(chat_id, product_id)

        elif data.startswith("cartinc_"):
            h.handle_cart_action(chat_id, "inc", data.split("_")[1])
        elif data.startswith("cartdec_"):
            h.handle_cart_action(chat_id, "dec", data.split("_")[1])
        elif data.startswith("cartdel_"):
            h.handle_cart_action(chat_id, "del", data.split("_")[1])
        elif data.startswith("cartnoop_"):
            pass

        elif data == "checkout":
            h.checkout(chat_id)

        elif data.startswith("paid_"):
            order_id = data.split("_")[1]
            h.handle_paid_claim(chat_id, order_id)

        elif data.startswith("rate_"):
            rating = data.split("_")[1]
            h.handle_review_rating(chat_id, rating)

        elif data.startswith("showname_"):
            show = data.split("_")[1] == "yes"
            h.handle_review_showname(chat_id, show)

        # Admin callbacks
        elif data.startswith("setstatus_"):
            parts = data.split("_", 2)
            h.handle_set_status(chat_id, parts[1], parts[2])

        elif data == "admin_products":
            api.send_message(chat_id, "🛍 Управление товарами:", reply_markup=kb.admin_products_keyboard())

        elif data == "admin_orders":
            h.show_admin_orders(chat_id)

        elif data == "admin_reviews":
            h.show_admin_reviews(chat_id)

        elif data.startswith("aorders_"):
            status_filter = data[len("aorders_"):]
            h.show_admin_orders(chat_id, status_filter)

        elif data == "admin_addcat":
            h.start_add_category(chat_id)

        elif data == "admin_addprod":
            h.start_add_product_step1(chat_id)

        elif data.startswith("addprod_cat_"):
            cat_id = int(data.split("_")[2])
            h.start_add_product_step2(chat_id, cat_id)

        elif data.startswith("selparent_"):
            parent_id = int(data.split("_")[1])
            db.set_state(chat_id, "admin_add_subcat_name", {"parent_id": parent_id})
            api.send_message(chat_id, "Введите название подкатегории:")

        elif data.startswith("editprod_"):
            api.send_message(chat_id, "Редактирование товаров будет доступно в следующей версии.")

        elif data.startswith("delprod_"):
            product_id = data.split("_")[1]
            h.handle_delete_product(chat_id, product_id)

        elif data.startswith("togglereview_"):
            review_id = data.split("_")[1]
            h.handle_toggle_review(chat_id, review_id)

        elif data == "admin_cats":
            h.show_admin_orders(chat_id)

        elif data == "admin_prods":
            h.show_admin_products_list(chat_id)

        return

    # ── Message ───────────────────────────────────────────────────────────
    if "message" not in update:
        return

    msg = update["message"]
    chat_id = msg["chat"]["id"]
    user_tg = msg.get("from", {})
    _ensure_user(user_tg)

    user = db.get_user(chat_id)
    state_info = db.get_state(chat_id)
    state = state_info["state"]

    # Photo message (admin adding product photo)
    if "photo" in msg and state == "admin_add_prod_photo":
        photo_id = msg["photo"][-1]["file_id"]
        h.handle_admin_prod_photo(chat_id, photo_id)
        return

    text = msg.get("text", "").strip()
    if not text:
        return

    # Commands
    if text == "/start":
        h.handle_start(chat_id, user)
        return

    if text == "/admin" and user and user.get("is_admin"):
        h.show_admin_panel(chat_id)
        return

    # State machine
    if state == "review_text":
        h.handle_review_text(chat_id, text)
        return

    if state == "admin_add_cat_name":
        h.handle_admin_add_cat_name(chat_id, text)
        return

    if state == "admin_add_subcat_name":
        parent_id = state_info["data"].get("parent_id")
        h.handle_admin_add_cat_name(chat_id, text, parent_id)
        return

    if state == "admin_add_prod_name":
        h.handle_admin_prod_name(chat_id, text)
        return

    if state == "admin_add_prod_desc":
        h.handle_admin_prod_desc(chat_id, text)
        return

    if state == "admin_add_prod_price":
        h.handle_admin_prod_price(chat_id, text)
        return

    if state == "admin_add_prod_photo" and text == "/skip":
        h.handle_admin_prod_photo(chat_id, None)
        return

    # Main menu buttons
    menu_map = {
        "📦 Каталог": lambda: h.show_root_categories(chat_id),
        "🛒 Корзина": lambda: h.show_cart(chat_id),
        "📋 Мои заказы": lambda: h.show_my_orders(chat_id),
        "⭐ Отзывы": lambda: h.show_reviews(chat_id),
        "ℹ️ Информация": lambda: api.send_message(chat_id, h.INFO_TEXT),
        "🔧 Админ-панель": lambda: h.show_admin_panel(chat_id) if user and user.get("is_admin") else None,
    }

    if text in menu_map:
        fn = menu_map[text]
        if fn:
            fn()
        return

    # Default
    km = kb.admin_menu() if user and user.get("is_admin") else kb.main_menu()
    api.send_message(chat_id, "Выберите раздел в меню:", reply_markup=km)


def _ensure_user(user_tg: dict):
    db.upsert_user(
        user_tg.get("id"),
        user_tg.get("username"),
        user_tg.get("first_name"),
        user_tg.get("last_name"),
    )