import db
import keyboards as kb
import bot_api as api
from db import ORDER_STATUSES

INFO_TEXT = """<b>ℹ️ Информация о магазине</b>

🛒 <b>Как работает предзаказ:</b>
Мы закупаем FPV-оборудование напрямую из Китая. Вы оформляете заказ, оплачиваете — мы выкупаем и доставляем.

📦 <b>Сроки доставки:</b>
• Выкуп в Китае: 3–7 дней
• Доставка до РФ: 20–40 дней
• Итого: 30–50 дней

💳 <b>Оплата:</b>
Перевод по реквизитам после оформления заказа.

⚠️ <b>Ответственность:</b>
Магазин не несёт ответственности за задержки на таможне. Возврат — только для товаров с заводским браком.

📞 <b>Контакты менеджера:</b>
@fpv_manager"""

PAYMENT_DETAILS = """<b>💳 Реквизиты для оплаты:</b>

🏦 Сбербанк: <code>1234 5678 9012 3456</code>
👤 Получатель: Иванов Иван И.

После перевода нажмите кнопку <b>"Я оплатил"</b> — администратор проверит и подтвердит оплату."""


# ── Start / Menu ─────────────────────────────────────────────────────────

def handle_start(chat_id, user):
    db.clear_state(chat_id)
    name = user.get("first_name") or "друг"
    km = kb.admin_menu() if user.get("is_admin") else kb.main_menu()
    api.send_message(
        chat_id,
        f"Привет, <b>{name}</b>! 👋\n\nДобро пожаловать в FPV Shop — магазин оборудования для FPV-дронов.\n\nВыберите раздел:",
        reply_markup=km,
    )


# ── Catalog ───────────────────────────────────────────────────────────────

def show_root_categories(chat_id):
    db.clear_state(chat_id)
    cats = db.get_categories(parent_id=None)
    if not cats:
        api.send_message(chat_id, "📦 Каталог пока пуст.")
        return
    api.send_message(chat_id, "📦 <b>Каталог</b>\n\nВыберите категорию:", reply_markup=kb.categories_keyboard(cats))


def show_subcategories_or_products(chat_id, cat_id):
    db.clear_state(chat_id)
    cat = db.get_category(cat_id)
    if not cat:
        api.send_message(chat_id, "Категория не найдена.")
        return

    subcats = db.get_categories(parent_id=cat_id)
    if subcats:
        api.send_message(
            chat_id,
            f"📂 <b>{cat['name']}</b>\n\nВыберите подкатегорию:",
            reply_markup=kb.categories_keyboard(subcats, with_back=True),
        )
    else:
        show_products_list(chat_id, cat_id)


def show_products_list(chat_id, cat_id):
    cat = db.get_category(cat_id)
    products = db.get_products(cat_id)
    if not products:
        api.send_message(chat_id, f"В категории <b>{cat['name']}</b> пока нет товаров.")
        return
    api.send_message(
        chat_id,
        f"🛍 <b>{cat['name']}</b>\n\nВыберите товар:",
        reply_markup=kb.products_keyboard(products, cat_id),
    )


def show_product(chat_id, product_id):
    p = db.get_product(product_id)
    if not p:
        api.send_message(chat_id, "Товар не найден.")
        return
    cat_id = p["category_id"]
    text = f"<b>{p['name']}</b>\n\n{p['description'] or ''}\n\n💰 Цена: <b>{p['price']:,.0f} ₽</b>"
    markup = kb.product_keyboard(product_id, cat_id)
    if p["photo_url"]:
        api.send_photo(chat_id, p["photo_url"], caption=text, reply_markup=markup)
    else:
        api.send_message(chat_id, text, reply_markup=markup)


# ── Cart ──────────────────────────────────────────────────────────────────

def show_cart(chat_id):
    db.clear_state(chat_id)
    items = db.get_cart(chat_id)
    if not items:
        api.send_message(chat_id, "🛒 Ваша корзина пуста.")
        return
    total = sum(i["price"] * i["quantity"] for i in items)
    lines = "\n".join(f"• {i['name']} × {i['quantity']} = {i['price'] * i['quantity']:,.0f} ₽" for i in items)
    text = f"🛒 <b>Ваша корзина:</b>\n\n{lines}\n\n<b>Итого: {total:,.0f} ₽</b>"
    api.send_message(chat_id, text, reply_markup=kb.cart_keyboard(items))


def add_to_cart(chat_id, product_id):
    db.add_to_cart(chat_id, product_id)
    api.send_message(chat_id, "✅ Товар добавлен в корзину!")


def handle_cart_action(chat_id, action, cart_id):
    if action == "inc":
        items = db.get_cart(chat_id)
        item = next((i for i in items if i["cart_id"] == int(cart_id)), None)
        if item:
            db.update_cart_item(int(cart_id), item["quantity"] + 1)
    elif action == "dec":
        items = db.get_cart(chat_id)
        item = next((i for i in items if i["cart_id"] == int(cart_id)), None)
        if item:
            db.update_cart_item(int(cart_id), item["quantity"] - 1)
    elif action == "del":
        db.update_cart_item(int(cart_id), 0)
    show_cart(chat_id)


# ── Checkout ──────────────────────────────────────────────────────────────

def checkout(chat_id):
    items = db.get_cart(chat_id)
    if not items:
        api.send_message(chat_id, "🛒 Корзина пуста.")
        return
    order_id = db.create_order(chat_id, items)
    db.clear_cart(chat_id)
    total = sum(i["price"] * i["quantity"] for i in items)
    lines = "\n".join(f"• {i['name']} × {i['quantity']}" for i in items)
    text = (
        f"✅ <b>Заказ #{order_id} оформлен!</b>\n\n{lines}\n\n"
        f"💰 Сумма: <b>{total:,.0f} ₽</b>\n\n{PAYMENT_DETAILS}"
    )
    api.send_message(chat_id, text, reply_markup=kb.order_detail_keyboard(order_id, is_pending=True))

    admins = _get_admin_ids()
    for admin_id in admins:
        api.send_message(
            admin_id,
            f"🆕 Новый заказ <b>#{order_id}</b>\n\nПользователь: {chat_id}\nСумма: {total:,.0f} ₽\n\n{lines}",
            reply_markup=kb.admin_order_keyboard(order_id, "pending_payment"),
        )


def handle_paid_claim(chat_id, order_id):
    order = db.get_order(int(order_id))
    if not order or order["user_id"] != chat_id:
        api.send_message(chat_id, "Заказ не найден.")
        return
    if order["status"] != "pending_payment":
        api.send_message(chat_id, "Этот заказ уже обработан.")
        return
    api.send_message(chat_id, "⏳ Ваш запрос отправлен администратору. Ожидайте подтверждения.")
    admins = _get_admin_ids()
    for admin_id in admins:
        api.send_message(
            admin_id,
            f"💸 Пользователь {chat_id} сообщил об оплате заказа <b>#{order_id}</b> на сумму {order['total_amount']:,.0f} ₽",
            reply_markup=kb.admin_order_keyboard(int(order_id), "pending_payment"),
        )


# ── Orders ────────────────────────────────────────────────────────────────

def show_my_orders(chat_id):
    db.clear_state(chat_id)
    orders = db.get_user_orders(chat_id)
    if not orders:
        api.send_message(chat_id, "📋 У вас пока нет заказов.")
        return
    lines = []
    for o in orders:
        status_label = ORDER_STATUSES.get(o["status"], o["status"])
        lines.append(f"<b>Заказ #{o['id']}</b> — {o['total_amount']:,.0f} ₽\nСтатус: {status_label}\n📅 {o['created_at'][:10]}")
    api.send_message(chat_id, "📋 <b>Мои заказы:</b>\n\n" + "\n\n".join(lines))


# ── Reviews ───────────────────────────────────────────────────────────────

def show_reviews(chat_id):
    db.clear_state(chat_id)
    reviews = db.get_reviews()
    if not reviews:
        api.send_message(chat_id, "⭐ Отзывов пока нет. Станьте первым!")
        return
    lines = []
    for r in reviews:
        stars = "⭐" * r["rating"]
        if r["show_name"]:
            author = f"@{r['username']}" if r["username"] else r["first_name"] or "Пользователь"
        else:
            author = "Анонимно"
        lines.append(f"{stars} <b>{author}</b>\n{r['text']}\n<i>{r['created_at'][:10]}</i>")
    api.send_message(chat_id, "⭐ <b>Отзывы покупателей:</b>\n\n" + "\n\n".join(lines))

    eligible = db.get_deliverable_orders_without_review(chat_id)
    if eligible:
        order_id = eligible[0]
        api.send_message(
            chat_id,
            f"📝 Вы можете оставить отзыв по заказу <b>#{order_id}</b>. Напишите текст отзыва:",
        )
        db.set_state(chat_id, "review_text", {"order_id": order_id})


def handle_review_text(chat_id, text):
    state = db.get_state(chat_id)
    order_id = state["data"].get("order_id")
    db.set_state(chat_id, "review_rating", {"order_id": order_id, "text": text})
    api.send_message(chat_id, "Оцените ваш опыт:", reply_markup=kb.review_rating_keyboard())


def handle_review_rating(chat_id, rating):
    state = db.get_state(chat_id)
    data = state["data"]
    data["rating"] = int(rating)
    db.set_state(chat_id, "review_showname", data)
    api.send_message(chat_id, "Показывать ваше имя в отзыве?", reply_markup=kb.review_show_name_keyboard())


def handle_review_showname(chat_id, show_name):
    state = db.get_state(chat_id)
    data = state["data"]
    db.create_review(chat_id, data["order_id"], data["text"], data["rating"], show_name)
    db.clear_state(chat_id)
    api.send_message(chat_id, "✅ Спасибо за ваш отзыв!")


# ── Admin ─────────────────────────────────────────────────────────────────

def show_admin_panel(chat_id):
    db.clear_state(chat_id)
    api.send_message(chat_id, "🔧 <b>Админ-панель</b>", reply_markup=kb.admin_panel_keyboard())


def show_admin_orders(chat_id, status_filter=None):
    orders = db.get_all_orders()
    if status_filter and status_filter != "all":
        orders = [o for o in orders if o["status"] == status_filter]
    if not orders:
        api.send_message(chat_id, "Заказов нет.", reply_markup=kb.admin_orders_filter())
        return
    lines = []
    for o in orders:
        status_label = ORDER_STATUSES.get(o["status"], o["status"])
        user_ref = f"@{o['username']}" if o["username"] else o["first_name"] or str(o["user_id"])
        lines.append(f"<b>#{o['id']}</b> {user_ref} — {o['total_amount']:,.0f} ₽ — {status_label}")
    api.send_message(chat_id, "📋 <b>Заказы:</b>\n\n" + "\n".join(lines), reply_markup=kb.admin_orders_filter())


def handle_set_status(chat_id, order_id, new_status):
    user_id = db.update_order_status(int(order_id), new_status)
    status_label = ORDER_STATUSES.get(new_status, new_status)
    api.send_message(chat_id, f"✅ Заказ <b>#{order_id}</b> → {status_label}")
    if user_id:
        api.send_message(
            user_id,
            f"📦 <b>Обновление по заказу #{order_id}</b>\n\nНовый статус: {status_label}",
        )
        if new_status == "delivered":
            eligible = db.get_deliverable_orders_without_review(user_id)
            if int(order_id) in eligible:
                api.send_message(
                    user_id,
                    f"🎉 Ваш заказ доставлен! Напишите текст отзыва и нажмите отправить:",
                )
                db.set_state(user_id, "review_text", {"order_id": int(order_id)})


def show_admin_reviews(chat_id):
    reviews = db.get_reviews(include_hidden=True)
    if not reviews:
        api.send_message(chat_id, "Отзывов нет.")
        return
    for r in reviews:
        stars = "⭐" * r["rating"]
        status = "🚫 Скрыт" if r["is_hidden"] else "👁 Виден"
        text = f"{stars} {status}\n{r['text']}\n<i>{r['created_at'][:10]}</i>"
        api.send_message(chat_id, text, reply_markup=kb.admin_review_keyboard(r["id"], r["is_hidden"]))


def handle_toggle_review(chat_id, review_id):
    is_hidden = db.toggle_review_hidden(int(review_id))
    status = "скрыт" if is_hidden else "виден"
    api.send_message(chat_id, f"Отзыв теперь {status}.")


# ── Admin: product/category management ───────────────────────────────────

def start_add_category(chat_id):
    db.set_state(chat_id, "admin_add_cat_name", {})
    api.send_message(chat_id, "Введите название новой категории:", reply_markup=kb.remove_keyboard())


def start_add_subcategory_step1(chat_id):
    cats = db.get_categories()
    if not cats:
        api.send_message(chat_id, "Сначала создайте корневую категорию.")
        return
    rows = [[[c["name"], f"selparent_{c['id']}"]] for c in cats]
    api.send_message(chat_id, "Выберите родительскую категорию:", reply_markup=kb.inline(rows))


def handle_admin_add_cat_name(chat_id, text, parent_id=None):
    db.create_category(text, parent_id)
    db.clear_state(chat_id)
    api.send_message(chat_id, f"✅ Категория <b>{text}</b> создана!", reply_markup=kb.admin_panel_keyboard())


def start_add_product_step1(chat_id):
    cats = db.get_categories()

    def collect_leaf(cat_list, depth=0):
        result = []
        for c in cat_list:
            subs = db.get_categories(c["id"])
            if subs:
                result.extend(collect_leaf(subs, depth + 1))
            else:
                result.append(c)
        return result

    leaves = collect_leaf(cats)
    if not leaves:
        api.send_message(chat_id, "Сначала создайте хотя бы одну подкатегорию или категорию без подкатегорий.")
        return
    rows = [[[c["name"], f"addprod_cat_{c['id']}"]] for c in leaves]
    api.send_message(chat_id, "Выберите категорию для товара:", reply_markup=kb.inline(rows))


def start_add_product_step2(chat_id, cat_id):
    db.set_state(chat_id, "admin_add_prod_name", {"cat_id": cat_id})
    api.send_message(chat_id, "Введите название товара:")


def handle_admin_prod_name(chat_id, text):
    state = db.get_state(chat_id)
    data = state["data"]
    data["name"] = text
    db.set_state(chat_id, "admin_add_prod_desc", data)
    api.send_message(chat_id, "Введите описание товара:")


def handle_admin_prod_desc(chat_id, text):
    state = db.get_state(chat_id)
    data = state["data"]
    data["desc"] = text
    db.set_state(chat_id, "admin_add_prod_price", data)
    api.send_message(chat_id, "Введите цену (число):")


def handle_admin_prod_price(chat_id, text):
    try:
        price = float(text.replace(",", ".").replace(" ", ""))
    except ValueError:
        api.send_message(chat_id, "Некорректная цена. Введите число:")
        return
    state = db.get_state(chat_id)
    data = state["data"]
    data["price"] = price
    db.set_state(chat_id, "admin_add_prod_photo", data)
    api.send_message(chat_id, "Отправьте фото товара или введите /skip:")


def handle_admin_prod_photo(chat_id, photo_url):
    state = db.get_state(chat_id)
    data = state["data"]
    pid = db.create_product(data["cat_id"], data["name"], data["desc"], data["price"], photo_url)
    db.clear_state(chat_id)
    api.send_message(chat_id, f"✅ Товар <b>{data['name']}</b> (ID {pid}) добавлен!", reply_markup=kb.admin_panel_keyboard())


def show_admin_products_list(chat_id):
    cats = db.get_categories()

    def show_cat(cat_list):
        for c in cat_list:
            subs = db.get_categories(c["id"])
            if subs:
                show_cat(subs)
            else:
                prods = db.get_products(c["id"])
                for p in prods:
                    text = f"<b>{p['name']}</b>\n💰 {p['price']:,.0f} ₽"
                    api.send_message(chat_id, text, reply_markup=kb.admin_product_manage_keyboard(p["id"]))

    if not cats:
        api.send_message(chat_id, "Товаров нет.")
        return
    show_cat(cats)


def handle_delete_product(chat_id, product_id):
    db.delete_product(int(product_id))
    api.send_message(chat_id, f"🗑 Товар #{product_id} удалён.")


# ── Helpers ───────────────────────────────────────────────────────────────

def _get_admin_ids():
    import psycopg2
    import os
    schema = os.environ.get("MAIN_DB_SCHEMA", "t_p6666792_eng_tutor_website_de")
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {schema}.tg_users WHERE is_admin = TRUE")
        ids = [r[0] for r in cur.fetchall()]
        cur.close()
        conn.close()
        return ids
    except Exception:
        return []
