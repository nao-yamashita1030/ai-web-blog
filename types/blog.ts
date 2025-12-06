export type Image = {
  url: string;
  width: number;
  height: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  category?: Category;
  tags?: Tag[];
  eyecatch?: Image;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};




