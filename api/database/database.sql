-- users table
CREATE TABLE users (
  id serial PRIMARY key NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  username VARCHAR(25) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  active boolean NOT NULL DEFAULT True,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD UNIQUE (email, username);

-- todo_lists table
CREATE TABLE todo_lists (
  id serial PRIMARY key NOT NULL,
  title text NOT NULL,
  user_id serial NOT NULL,
  is_delete boolean NOT NULL DEFAULT False,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE todo_lists add CONSTRAINT todo_list_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);

-- todo_items table
CREATE TABLE todo_items (
  id serial PRIMARY key NOT NULL,
  content text NOT NULL,
  user_id serial NOT NULL,
  todo_list_id serial NOT NULL,
  is_done boolean NOT NULL DEFAULT False,
  is_delete boolean NOT NULL DEFAULT False,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE todo_items add CONSTRAINT todo_items_user_id_fk FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE todo_items add CONSTRAINT todo_items_todo_list_id_fk FOREIGN KEY (todo_list_id) REFERENCES todo_lists (id);
