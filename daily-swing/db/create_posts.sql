-- create_posts.sql
-- Creates a simple `posts` table and inserts sample rows.
-- Run this in Supabase SQL Editor (or using psql) against your project's database.

create table if not exists public.posts (
  id bigserial primary key,
  title text not null,
  content text,
  author text,
  published boolean default false,
  created_at timestamptz default now()
);

-- sample data
insert into public.posts (title, content, author, published)
values
  ('Hello world', 'This is the first post', 'system', true),
  ('Draft post', 'Not published yet', 'minth', false)
on conflict do nothing;

-- simple select to verify
select * from public.posts limit 5;
