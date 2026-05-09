from db import ORDER_STATUSES, STATUS_SEQUENCE


def inline(buttons):
    """buttons: list of list of (text, callback_data)"""
    return {
        "inline_keyboard": [
            [{"text": t, "callback_data": d} for t, d in row]
            for row in buttons
        ]
    }


def reply(buttons, resize=True, one_time=False):
    """buttons: list of list of str"""
    return {
        "keyboard": [[{"text": t} for t in row] for row in buttons],
        "resize_keyboard": resize,
        "one_time_keyboard": one_time,
    }


def remove_keyboard():
    return {"remove_keyboard": True}


# ── Main Menu ─────────────────────────────────────────────────────────────

def main_menu():
    return reply([
        ["📦 Каталог", "🛒 Корзина"],
        ["📋 Мои заказы", "⭐ Отзывы"],
        ["ℹ️ Информация"],
    ])


def admin_menu():
    return reply([
        ["📦 Каталог", "🛒 Корзина"],
        ["📋 Мои заказы", "⭐ Отзывы"],
        ["ℹ️ Информация"],
        ["🔧 Админ-панель"],
    ])


# ── Catalog ───────────────────────────────────────────────────────────────

def categories_keyboard(categories, with_back=False):
    rows = [[cat["name"], f"cat_{cat['id']}"] for cat in categories]
    kb = [[r] for r in [rows]]
    # rebuild properly
    kb = [[[cat["name"], f"cat_{cat['id']}"]] for cat in categories]
    if with_back:
        kb.append([["◀️ Назад", "cat_back"]])
    return inline(kb)


def products_keyboard(products, cat_id):
    rows = [[[p["name"], f"prod_{p['id']}"]] for p in products]
    rows.append([["◀️ Назад", f"cat_{cat_id}"]])
    return inline(rows)


def product_keyboard(product_id, cat_id):
    return inline([
        [["🛒 В корзину", f"addcart_{product_id}"]],
        [["◀️ Назад", f"prodlist_{cat_id}"]],
    ])


# ── Cart ──────────────────────────────────────────────────────────────────

def cart_keyboard(cart_items):
    rows = []
    for item in cart_items:
        rows.append([
            [f"➖", f"cartdec_{item['cart_id']}"],
            [f"{item['quantity']} шт.", f"cartnoop_{item['cart_id']}"],
            [f"➕", f"cartinc_{item['cart_id']}"],
            [f"🗑", f"cartdel_{item['cart_id']}"],
        ])
    rows.append([["✅ Оформить заказ", "checkout"]])
    return inline(rows)


# ── Orders ────────────────────────────────────────────────────────────────

def order_detail_keyboard(order_id, is_pending=False):
    rows = []
    if is_pending:
        rows.append([["💸 Я оплатил", f"paid_{order_id}"]])
    return inline(rows) if rows else None


def admin_order_keyboard(order_id, current_status):
    rows = []
    idx = STATUS_SEQUENCE.index(current_status) if current_status in STATUS_SEQUENCE else -1
    if idx >= 0 and idx < len(STATUS_SEQUENCE) - 1:
        next_status = STATUS_SEQUENCE[idx + 1]
        rows.append([[f"▶️ {ORDER_STATUSES[next_status]}", f"setstatus_{order_id}_{next_status}"]])
    if current_status == "pending_payment":
        rows.append([["✅ Подтвердить оплату", f"setstatus_{order_id}_paid"]])
    return inline(rows) if rows else None


def admin_orders_filter():
    return inline([
        [["Все заказы", "aorders_all"]],
        [["Ожидают оплаты", "aorders_pending_payment"]],
        [["Оплаченные", "aorders_paid"]],
    ])


# ── Reviews ───────────────────────────────────────────────────────────────

def review_rating_keyboard():
    return inline([[
        ["⭐ 1", "rate_1"], ["⭐ 2", "rate_2"], ["⭐ 3", "rate_3"],
        ["⭐ 4", "rate_4"], ["⭐ 5", "rate_5"],
    ]])


def review_show_name_keyboard():
    return inline([
        [["✅ Показывать имя", "showname_yes"]],
        [["🙈 Анонимно", "showname_no"]],
    ])


def admin_review_keyboard(review_id, is_hidden):
    label = "👁 Показать отзыв" if is_hidden else "🚫 Скрыть отзыв"
    return inline([[[label, f"togglereview_{review_id}"]]])


# ── Admin panel ───────────────────────────────────────────────────────────

def admin_panel_keyboard():
    return inline([
        [["📦 Товары", "admin_products"]],
        [["📋 Заказы", "admin_orders"]],
        [["⭐ Отзывы", "admin_reviews"]],
    ])


def admin_products_keyboard():
    return inline([
        [["➕ Добавить категорию", "admin_addcat"]],
        [["➕ Добавить товар", "admin_addprod"]],
        [["🗂 Управление категориями", "admin_cats"]],
        [["🛍 Управление товарами", "admin_prods"]],
    ])


def admin_product_manage_keyboard(product_id):
    return inline([
        [["✏️ Редактировать", f"editprod_{product_id}"]],
        [["🗑 Удалить", f"delprod_{product_id}"]],
    ])
