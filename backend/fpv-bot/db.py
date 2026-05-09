import os
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p6666792_eng_tutor_website_de")


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def q(table):
    return f"{SCHEMA}.{table}"


# ── Users ──────────────────────────────────────────────────────────────────

def upsert_user(user_id, username, first_name, last_name):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""INSERT INTO {q("tg_users")} (id, username, first_name, last_name)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET
                        username = EXCLUDED.username,
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name""",
                (user_id, username, first_name, last_name),
            )


def get_user(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"SELECT id, username, first_name, is_admin FROM {q('tg_users')} WHERE id = %s", (user_id,))
            row = cur.fetchone()
            if row:
                return {"id": row[0], "username": row[1], "first_name": row[2], "is_admin": row[3]}
    return None


def is_admin(user_id):
    user = get_user(user_id)
    return user and user.get("is_admin")


# ── State ─────────────────────────────────────────────────────────────────

def set_state(user_id, state, data=None):
    import json
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""INSERT INTO {q("user_states")} (user_id, state, data, updated_at)
                    VALUES (%s, %s, %s, NOW())
                    ON CONFLICT (user_id) DO UPDATE SET state = EXCLUDED.state, data = EXCLUDED.data, updated_at = NOW()""",
                (user_id, state, json.dumps(data or {})),
            )


def get_state(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"SELECT state, data FROM {q('user_states')} WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            if row:
                return {"state": row[0], "data": row[1] or {}}
    return {"state": None, "data": {}}


def clear_state(user_id):
    set_state(user_id, None, {})


# ── Categories ────────────────────────────────────────────────────────────

def get_categories(parent_id=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            if parent_id is None:
                cur.execute(
                    f"SELECT id, name FROM {q('categories')} WHERE parent_id IS NULL AND is_active = TRUE ORDER BY sort_order, id"
                )
            else:
                cur.execute(
                    f"SELECT id, name FROM {q('categories')} WHERE parent_id = %s AND is_active = TRUE ORDER BY sort_order, id",
                    (parent_id,),
                )
            return [{"id": r[0], "name": r[1]} for r in cur.fetchall()]


def get_category(cat_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"SELECT id, name, parent_id FROM {q('categories')} WHERE id = %s", (cat_id,))
            row = cur.fetchone()
            if row:
                return {"id": row[0], "name": row[1], "parent_id": row[2]}
    return None


def create_category(name, parent_id=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {q('categories')} (name, parent_id) VALUES (%s, %s) RETURNING id",
                (name, parent_id),
            )
            return cur.fetchone()[0]


def delete_category(cat_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {q('categories')} SET is_active = FALSE WHERE id = %s", (cat_id,))


# ── Products ──────────────────────────────────────────────────────────────

def get_products(category_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, name, price, photo_url FROM {q('products')} WHERE category_id = %s AND is_active = TRUE ORDER BY sort_order, id",
                (category_id,),
            )
            return [{"id": r[0], "name": r[1], "price": float(r[2]), "photo_url": r[3]} for r in cur.fetchall()]


def get_product(product_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, name, description, price, photo_url, category_id FROM {q('products')} WHERE id = %s",
                (product_id,),
            )
            row = cur.fetchone()
            if row:
                return {"id": row[0], "name": row[1], "description": row[2], "price": float(row[3]), "photo_url": row[4], "category_id": row[5]}
    return None


def create_product(category_id, name, description, price, photo_url=None):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {q('products')} (category_id, name, description, price, photo_url) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (category_id, name, description, price, photo_url),
            )
            return cur.fetchone()[0]


def update_product(product_id, **fields):
    allowed = {"name", "description", "price", "photo_url", "category_id", "is_active"}
    sets = []
    values = []
    for k, v in fields.items():
        if k in allowed:
            sets.append(f"{k} = %s")
            values.append(v)
    if not sets:
        return
    values.append(product_id)
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {q('products')} SET {', '.join(sets)} WHERE id = %s", values)


def delete_product(product_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"UPDATE {q('products')} SET is_active = FALSE WHERE id = %s", (product_id,))


# ── Cart ──────────────────────────────────────────────────────────────────

def get_cart(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""SELECT ci.id, p.id, p.name, p.price, ci.quantity, p.photo_url
                    FROM {q('cart_items')} ci
                    JOIN {q('products')} p ON p.id = ci.product_id
                    WHERE ci.user_id = %s AND p.is_active = TRUE""",
                (user_id,),
            )
            return [{"cart_id": r[0], "product_id": r[1], "name": r[2], "price": float(r[3]), "quantity": r[4], "photo_url": r[5]} for r in cur.fetchall()]


def add_to_cart(user_id, product_id, quantity=1):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""INSERT INTO {q('cart_items')} (user_id, product_id, quantity)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = {q('cart_items')}.quantity + EXCLUDED.quantity""",
                (user_id, product_id, quantity),
            )


def update_cart_item(cart_id, quantity):
    with get_conn() as conn:
        with conn.cursor() as cur:
            if quantity <= 0:
                cur.execute(f"DELETE FROM {q('cart_items')} WHERE id = %s", (cart_id,))
            else:
                cur.execute(f"UPDATE {q('cart_items')} SET quantity = %s WHERE id = %s", (quantity, cart_id))


def clear_cart(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"DELETE FROM {q('cart_items')} WHERE user_id = %s", (user_id,))


# ── Orders ────────────────────────────────────────────────────────────────

ORDER_STATUSES = {
    "pending_payment": "⏳ Ожидает оплаты",
    "paid": "✅ Оплачен",
    "bought_cn": "🛒 Выкуплен в Китае",
    "shipped_cn": "✈️ Отправлен из Китая",
    "in_transit": "🚢 В пути",
    "in_ru": "🇷🇺 В РФ",
    "delivering": "🚚 Доставляется",
    "delivered": "📦 Доставлен",
}

STATUS_SEQUENCE = list(ORDER_STATUSES.keys())


def create_order(user_id, cart_items):
    total = sum(i["price"] * i["quantity"] for i in cart_items)
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {q('orders')} (user_id, total_amount) VALUES (%s, %s) RETURNING id",
                (user_id, total),
            )
            order_id = cur.fetchone()[0]
            for item in cart_items:
                cur.execute(
                    f"INSERT INTO {q('order_items')} (order_id, product_id, product_name, product_price, quantity) VALUES (%s, %s, %s, %s, %s)",
                    (order_id, item["product_id"], item["name"], item["price"], item["quantity"]),
                )
    return order_id


def get_order(order_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, user_id, total_amount, status, created_at FROM {q('orders')} WHERE id = %s",
                (order_id,),
            )
            row = cur.fetchone()
            if not row:
                return None
            order = {"id": row[0], "user_id": row[1], "total_amount": float(row[2]), "status": row[3], "created_at": str(row[4])}
            cur.execute(
                f"SELECT product_name, product_price, quantity FROM {q('order_items')} WHERE order_id = %s",
                (order_id,),
            )
            order["items"] = [{"name": r[0], "price": float(r[1]), "quantity": r[2]} for r in cur.fetchall()]
    return order


def get_user_orders(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"SELECT id, total_amount, status, created_at FROM {q('orders')} WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,),
            )
            return [{"id": r[0], "total_amount": float(r[1]), "status": r[2], "created_at": str(r[3])} for r in cur.fetchall()]


def get_all_orders(limit=50):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""SELECT o.id, o.user_id, u.username, u.first_name, o.total_amount, o.status, o.created_at
                    FROM {q('orders')} o
                    LEFT JOIN {q('tg_users')} u ON u.id = o.user_id
                    ORDER BY o.created_at DESC LIMIT %s""",
                (limit,),
            )
            return [{"id": r[0], "user_id": r[1], "username": r[2], "first_name": r[3], "total_amount": float(r[4]), "status": r[5], "created_at": str(r[6])} for r in cur.fetchall()]


def update_order_status(order_id, status):
    with get_conn() as conn:
        with conn.cursor() as cur:
            extra = ""
            if status == "paid":
                extra = ", payment_confirmed_at = NOW()"
            cur.execute(
                f"UPDATE {q('orders')} SET status = %s, updated_at = NOW(){extra} WHERE id = %s RETURNING user_id",
                (status, order_id),
            )
            row = cur.fetchone()
            return row[0] if row else None


def get_deliverable_orders_without_review(user_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"""SELECT o.id FROM {q('orders')} o
                    LEFT JOIN {q('reviews')} r ON r.order_id = o.id
                    WHERE o.user_id = %s AND o.status = 'delivered' AND r.id IS NULL""",
                (user_id,),
            )
            return [r[0] for r in cur.fetchall()]


# ── Reviews ───────────────────────────────────────────────────────────────

def create_review(user_id, order_id, text, rating, show_name):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"INSERT INTO {q('reviews')} (user_id, order_id, text, rating, show_name) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (user_id, order_id, text, rating, show_name),
            )
            return cur.fetchone()[0]


def get_reviews(include_hidden=False):
    with get_conn() as conn:
        with conn.cursor() as cur:
            where = "" if include_hidden else "WHERE r.is_hidden = FALSE"
            cur.execute(
                f"""SELECT r.id, r.text, r.rating, r.show_name, r.created_at, u.username, u.first_name, r.is_hidden
                    FROM {q('reviews')} r
                    LEFT JOIN {q('tg_users')} u ON u.id = r.user_id
                    {where}
                    ORDER BY r.created_at DESC""",
            )
            rows = []
            for row in cur.fetchall():
                rows.append({
                    "id": row[0], "text": row[1], "rating": row[2],
                    "show_name": row[3], "created_at": str(row[4]),
                    "username": row[5], "first_name": row[6], "is_hidden": row[7],
                })
            return rows


def toggle_review_hidden(review_id):
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                f"UPDATE {q('reviews')} SET is_hidden = NOT is_hidden WHERE id = %s RETURNING is_hidden",
                (review_id,),
            )
            row = cur.fetchone()
            return row[0] if row else None
