# Итоговое задание по блоку "HTML, CSS и сборщики"

Верстка макета с использование Pug, SCSS, Webpack 

## Команды запуска проекта:

`yarn prod //Сборка проекта в production режиме`

`yarn build //Сборка проекта в development режиме`

`yarn dev //Запуск свервера разработки на порту 3000`

## Примечания:

- Я решил не влючать во фреймворк ничего из того, что не было отображено на макете UI Kit. Так же, в него не включены те элементы, которые используются только в UI Kit. Иначе говоря, на выходе получилось 3 css файла: с элементами фреймворка, с элементами только для страницы uikit и с элементами только для страницы index. Но в целом, нет абсолютно никаких препятсвий сделать так, что фреймворк охватывал собой весь проект.
- Взамен коммерческим шрифтам из проекта был выбран Montserrat, так как он поддерживает все необходимые стили написания
- Я вполне осознанно проигнорировал заметку о том, что боковая панель должна быть в высоту страницы, а не экрана. Но посчитал что цель изначального дизайна была именно в том, чтобы панель была видна вся и в любом месте страницы
