# monitor-web

<p align="left">
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>

<code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vue/vue.png" alt="vue" /></code>
<code><img height="20" src="https://camo.githubusercontent.com/61e102d7c605ff91efedb9d7e47c1c4a07cef59d3e1da202fd74f4772122ca4e/68747470733a2f2f766974656a732e6465762f6c6f676f2e737667" alt="vite" /></code>
<code><img height="20" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png" alt="typescript" /></code>

需要配合 [server](https://github.com/mayswind/AriaNg) 端一起使用
  
### 运行截图
  
![20211119-154655](https://user-images.githubusercontent.com/21986958/142585177-68dfdfbb-cf4a-46e5-ae80-c39e3e9ad03a.png)

## 设置

运行前需要编辑`src/config.ts`来添加监控的服务

```
const serverList: server[] = [
  // { name: '名称', api: 'server端地址' },
  ...
  ...
]
```

## 运行

```
#编译
npm run build
#运行
npm run start
```
  
## License

MIT
