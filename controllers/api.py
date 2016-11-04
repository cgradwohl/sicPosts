# These are the controllers for your ajax api.
def edit_post():
    p = db(db.post.id == request.vars.post_id).select().first()
    return response.json(dict(post=p))


def update_post():
    p = db(db.post.id == request.vars.post_id).select().first()
    p.post_content = request.vars.post_content
    return response.json(dict(post=p))



def get_posts():
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    posts = []
    has_more = False
    rows = db().select(db.post.ALL, orderby=~db.post.created_on, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            p = dict(
                id = r.id,
                post_content = r.post_content,
            )
            posts.append(p)
        else:
            has_more = True
    logged_in = auth.user_id is not None
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    p_id = db.post.insert(
        post_content = request.vars.post_content
    )
    p = db.post(p_id)
    return response.json(dict(post=p))



@auth.requires_signature()
def del_post():
    """Used to delete a post."""
    db(db.post.id == request.vars.post_id).delete()
    return "ok"
