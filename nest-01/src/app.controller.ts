import {
  Controller,
  Param,
  Get,
  Render,
  ParseIntPipe,
  Post,
  Redirect,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { articles } from './articles';
import { Article } from './article.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { articles };
  }

  @Get('create')
  @Render('create-article')
  getForm(): void {
    return;
  }

  @Get(':id')
  @Render('article')
  getById(@Param('id', ParseIntPipe) id: number) {
    const arrFind = articles.find((article) => article.id === id);
    return arrFind;
  }
  @Post('articles')
  @Redirect('/', 301)
  create(@Body() body: any): void {
    const id = articles.length + 1;
    const article = new Article(body.title, body.content, id, body.link);
    articles.push(article);
  }
}
