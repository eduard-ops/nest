export class Article {
  id: number;

  title: string;

  content: string;

  link: string;

  constructor(title: string, content: string, id?: number, link?: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.link = link;
  }
}
