# ScoreDraft 编辑器

ScoreDraft 编辑器是一个基于 [Electron](https://www.electronjs.org/) 的 ScoreDraft 编辑界面，主要针对其[基于 YAML 格式的输入](https://fynv.github.io/ScoreDraft/intro_cn.html#%E5%9F%BA%E4%BA%8E-yaml-%E6%A0%BC%E5%BC%8F%E7%9A%84%E8%BE%93%E5%85%A5)。ScoreDraft 编辑器可用于音乐的作曲、预览、雕刻(借助[LilyPond](http://lilypond.org/)) 以及分享为一个静态HTML展示页。

类似于LilyPond，ScoreDraft 编辑器通过简单的文本录入界面来支持你的创作过程，而不是多数 DAW 采用的钢琴卷帘界面。相比于LilyPond，ScoreDraft 增强了以下方面的功能：

* 提供了内置的合成器，支持SoundFont2。在创作过程中可以随时使用合成器，声音质量可以远远高于操作系统提供的音序器，当然，与选用的音源有关。

* 提供了人声合成器，兼容[UTAU](http://utau.us)格式。这样作曲家不仅可以预览旋律，还可以预览人声。

* 提供了乐谱可视化工具Meteor。可视化模块可以内置于HTML展示页用于分享。

在提供了上述功能的同时，ScoreDraft 编辑器也允许你制作高质量的乐谱。在生成展示页的过程中，LilyPond被后台调用来雕刻乐谱，同时一个.ly文件被作为中间结果生成。你可以手动修饰这个文件以得到更加精美的乐谱。

## 组件获取

ScoreDraft 编辑器建立在诸多优秀的开源作品之上，这些组件需要由不同的途径来获取。

### Python

请由以下链接获取Python 3.x：

[Welcome to Python.org](https://www.python.org/)

or [Miniconda — Conda documentation](https://docs.conda.io/en/latest/miniconda.html)

### LilyPond

[LilyPond – 人人的乐谱软件](http://lilypond.org/)

### ScoreDraft

这里你需要的PyPi包是 scoredraft_editor 包 而不是 scoredraft 包，前者提供了专用于ScoreDraft编辑器的额外组件。

```shell
# pip install scoredraft_editor
```

### 编辑器

编辑器本身比它的Electron外壳要小得多，所以最好的安装方法是使用Electron的[手动发布](https://www.electronjs.org/zh/docs/latest/tutorial/application-distribution#%E6%89%8B%E5%8A%A8%E5%8F%91%E5%B8%83)流程，下载 prebuilt binaries，然后把本仓库的全部代码拷贝到electron目录下 （可能需要把 default_app.asar 删除掉）。

你也可以看一下release页面，我可能会放上完整的发布包。

### 用户手册

[https://fynv.github.io/ScoreDraftEditor/README_cn.html](https://fynv.github.io/ScoreDraftEditor/README_cn.html)

### 版权协议

MIT 协议

