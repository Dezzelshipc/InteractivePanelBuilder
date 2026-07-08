# InteractivePanelBuilder

## Формат WebSocket

Панель имеет подписочный вид сокетов с топиками: единственный сервер отправляет данные в соответствии с топиками.

Панель отправляет на сервер

```ts
JSON.stringify({
  topic: string,
  action: 'subscribe' | 'unsubscribe',
})
```

Панель принимает с сервера

```ts
JSON.stringify({
  topic: string,
  payload: any,
})
```

- "_Топик WebSockets для виджета_" принимает json всего виджета.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
