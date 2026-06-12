import type { ResourceArticle } from '../types';

export const RESOURCE_CATEGORIES = [
  'applications',
  'essays',
  'interviews',
  'networking',
  'funding',
  'mindset',
] as const;

export const RESOURCES: ResourceArticle[] = [
  {
    id: 'r1',
    slug: 'cold-application-system',
    category: 'applications',
    title: {
      en: 'The Cold Application System: winning without a referral',
      zh: '无人引荐也能赢：冷申请方法论',
    },
    excerpt: {
      en: 'A repeatable five-step system for applying to competitive programs when nobody in your life has done it before you.',
      zh: '当你身边没有任何人走过这条路时，一套可复用的五步申请系统。',
    },
    readMinutes: 12,
    body: [
      {
        en: 'Most application advice assumes you have someone to ask — a professor who won the same award, a cousin at the company, a counselor who has seen a hundred essays. This guide assumes you have no one. That is not a disadvantage you must apologize for; it is a constraint you can engineer around.',
        zh: '大多数申请建议都默认你有人可问——拿过同一个奖的教授、在那家公司工作的表亲、看过上百篇文书的升学顾问。这篇指南假设你谁都没有。这不是需要道歉的劣势，而是一个可以被工程化解决的约束条件。',
      },
      {
        en: 'Step one: reconstruct the rubric. Every selective program publishes more of its selection criteria than people realize — in FAQs, in alumni interviews, in the bios of past winners. Spend two hours building a list of the ten phrases that recur. That list is your rubric; every sentence you write will serve one of those phrases.',
        zh: '第一步：重建评分标准。每个选拔性项目公开的评审标准都比人们以为的多——藏在 FAQ、校友访谈和往届得主的简介里。花两个小时整理出反复出现的十个关键词。这个清单就是你的评分表；你写下的每一句话都要服务于其中一个关键词。',
      },
      {
        en: 'Step two: find the shadow network. You cannot get a referral, but you can get fifteen minutes. Past winners reply to short, specific messages at a surprising rate — especially ones from people who remind them of themselves. Ask one question per message, never "any advice?".',
        zh: '第二步：寻找影子网络。你拿不到内推，但你能要到十五分钟。往届得主对简短、具体的私信回复率高得惊人——尤其是来自"像当年的自己"的人。每条消息只问一个问题，永远不要问"有什么建议吗？"。',
      },
      {
        en: 'Steps three through five — evidence inventory, the outsider draft, and the 48-hour review loop — turn your distance from the institution into the most memorable thing about your file. Committees read four hundred polished applications; they remember the one that saw the program clearly from outside.',
        zh: '第三到五步——证据清单、"局外人"初稿、48 小时互审循环——会把你与体制的距离变成你材料中最令人难忘的部分。评委要读四百份精致的申请；他们记住的，是那份从圈外把项目看得最透彻的。',
      },
    ],
  },
  {
    id: 'r2',
    slug: 'personal-statement-architecture',
    category: 'essays',
    title: {
      en: 'Personal statement architecture: the three-act outsider essay',
      zh: '个人陈述的结构学：三幕式"破圈"文书',
    },
    excerpt: {
      en: 'Stop writing chronology. A structural template that turns an unconventional background into selection-committee gold.',
      zh: '别再按时间顺序写了。一个能把非典型背景变成评委眼中黄金的结构模板。',
    },
    readMinutes: 9,
    body: [
      {
        en: 'The weakest essays narrate a life. The strongest essays argue a thesis with a life as evidence. Your thesis is never "I worked hard" — it is one precise claim about how you see the world that the committee could not get from anyone else in the pool.',
        zh: '最弱的文书在叙述人生。最强的文书在论证一个命题，而人生只是论据。你的命题绝不是"我很努力"——而是一个关于你如何看世界的精确判断，是评委从这届申请池里其他任何人那里都得不到的。',
      },
      {
        en: 'Act one: the constraint. Open inside a concrete scene that shows the boundary you started with — a town, a job, a kitchen table. No self-pity, no statistics. One paragraph, maximum.',
        zh: '第一幕：约束。从一个具体场景写起，呈现你出发时的边界——一个小镇、一份工作、一张餐桌。不卖惨，不堆数据。最多一段。',
      },
      {
        en: 'Act two: the break. The moment you acted against the default. Committees care about agency: what did you do that nobody around you was doing, and what did it cost? This is the longest act and the only place achievements belong — always as consequences of the break, never as a list.',
        zh: '第二幕：破圈。你违背默认剧本采取行动的那个时刻。评委在乎的是能动性：你做了什么周围没人在做的事，付出了什么代价？这是篇幅最长的一幕，也是成就唯一该出现的地方——永远作为"破圈"的结果出现，绝不是罗列。',
      },
      {
        en: 'Act three: the return. Every elite program is quietly asking the same question: if we hand you this key, what door will you open, and for whom? Answer it literally. Name the people still inside the circle you left, and what you will build for them.',
        zh: '第三幕：归来。每个顶尖项目都在默默问同一个问题：如果我们把这把钥匙交给你，你会去打开哪扇门、为谁打开？请直接回答。说出还留在你离开的那个圈子里的人，以及你将为他们建造什么。',
      },
    ],
  },
  {
    id: 'r3',
    slug: 'interview-room-decode',
    category: 'interviews',
    title: {
      en: 'Decoding the interview room: what panels actually score',
      zh: '面试房间解码：评审团真正在打分的是什么',
    },
    excerpt: {
      en: 'Fellowship panels score four things, and only one of them is your answers. Preparation drills for the other three.',
      zh: '评审团打分的维度有四个，你的回答只占其一。这是另外三个维度的训练方法。',
    },
    readMinutes: 11,
    body: [
      {
        en: 'After the interview, panelists fill in a form. The form rarely has a box for "answered question three well." It has boxes like presence, judgment, self-awareness, and trajectory. Your answers are merely the raw material panels use to score those four.',
        zh: '面试结束后，评委要填一张表。表上几乎不会有"第三题答得好"这一栏，而是这样的栏目：气场、判断力、自我认知、成长轨迹。你的回答只是评委为这四项打分的原材料。',
      },
      {
        en: 'Presence is trainable in a week: it is 80% pace. Record yourself answering "tell me about yourself" and count the words per minute. Almost everyone under pressure speaks 30% too fast. Practicing one deliberate pause per answer reads as confidence.',
        zh: '气场一周就能练出来：它的 80% 是语速。录下你回答"介绍一下自己"，数一数每分钟说了多少词。几乎所有人在压力下都会快 30%。练习在每个回答里放一次刻意的停顿，听起来就是从容。',
      },
      {
        en: 'Judgment is scored when they push back. The drill: have a friend disagree with your proudest project — "wasn’t that wasteful?" The winning move is never defense; it is showing you have already weighed that exact trade-off, and naming the condition under which the critic would be right.',
        zh: '判断力在他们反驳你时被打分。训练方法：让朋友质疑你最自豪的项目——"那不是很浪费吗？"得分的应对从来不是辩护，而是展示你早已权衡过这个取舍，并说出在什么条件下对方是对的。',
      },
      {
        en: 'Self-awareness has a one-question test panels love: "what would you do differently?" A weak answer picks a fake flaw. A strong answer names a real cost someone else paid for your learning — and what you changed because of it.',
        zh: '自我认知有一道评委最爱的测试题："如果重来你会怎么做？"弱答案挑一个假缺点。强答案说出一个真实的代价——别人为你的成长付出的代价——以及你因此做出的改变。',
      },
    ],
  },
  {
    id: 'r4',
    slug: 'networking-without-network',
    category: 'networking',
    title: {
      en: 'Networking when you start with zero network',
      zh: '从零人脉开始的人脉学',
    },
    excerpt: {
      en: 'The 15-minute message, the alumni ladder, and how strangers become referees within one application season.',
      zh: '十五分钟法则、校友阶梯，以及如何在一个申请季内让陌生人变成你的推荐人。',
    },
    readMinutes: 8,
    body: [
      {
        en: 'Cold outreach has a terrible reputation because most of it is terrible. The fix is specificity: a message that could only have been written to this one person, asking one question that only they can answer, answerable in under five minutes.',
        zh: '陌生开发名声很差，因为大多数私信确实写得很差。解法是具体：一条只可能写给这个人的消息，问一个只有 TA 能回答的问题，而且五分钟内就能答完。',
      },
      {
        en: 'Build the alumni ladder: start with people one step ahead of you, not ten. The senior who just won the scholarship will answer; the minister will not. Each rung introduces you to the next. Three rungs is usually enough to reach anyone in a field.',
        zh: '搭建校友阶梯：从领先你一步的人开始，而不是十步。刚拿到奖学金的学长会回复你；部长不会。每一级阶梯会把你引荐到下一级。三级阶梯通常足以触达一个领域里的任何人。',
      },
      {
        en: 'Convert conversations into referees deliberately. After a genuinely useful exchange, ship them an update a month later: "you suggested X, I did it, here is what happened." Two updates later, asking them to be a reference is natural — you have shown them a trajectory, which is exactly what they will be asked to vouch for.',
        zh: '有意识地把对话转化为推荐人。在一次真正有价值的交流之后，一个月后给对方发一条进展："你建议我做 X，我做了，结果是这样。"两次进展更新之后，请对方做推荐人就是水到渠成——你已经向 TA 展示了一条轨迹，而这恰恰是推荐信要担保的东西。',
      },
    ],
  },
  {
    id: 'r5',
    slug: 'funding-stack',
    category: 'funding',
    title: {
      en: 'The funding stack: combining awards to reach 100%',
      zh: '资助叠加术：把多个奖项拼成 100% 覆盖',
    },
    excerpt: {
      en: 'Partial scholarship ≠ unaffordable. How experienced applicants legally stack stipends, grants, fee waivers and travel funds.',
      zh: '部分奖学金 ≠ 上不起。有经验的申请者如何合规地叠加津贴、补助、费用减免与差旅基金。',
    },
    readMinutes: 10,
    body: [
      {
        en: 'A 40% scholarship plus a teaching assistantship plus a country-specific travel grant is a full ride wearing three coats. Most applicants stop reading at the headline percentage; the ones who get out read the terms and stack.',
        zh: '40% 的奖学金 + 助教岗位 + 面向特定国家的差旅补助，就是一份穿着三件外套的全额资助。大多数申请者读到标题上的百分比就停了；真正走出去的人会读完条款，然后开始叠加。',
      },
      {
        en: 'The stack has four layers, in order of reliability: institutional (the program’s own awards), governmental (your country’s outbound grants and the host country’s inbound ones), foundation (field-specific trusts, often undersubscribed), and crowd (employer sponsorship, community funds). Always check stacking clauses — most awards only prohibit duplicating the same cost, not combining different ones.',
        zh: '资助栈有四层，按可靠性排序：院校层（项目自有奖项）、政府层（你所在国的外派资助与东道国的引进资助）、基金会层（特定领域的信托基金，常常没人申请）、社群层（雇主赞助、社区基金）。务必查看叠加条款——大多数奖项只禁止重复覆盖同一项费用，并不禁止组合不同费用。',
      },
      {
        en: 'Build a one-page funding map per opportunity before you apply: tuition, housing, flights, visa, insurance in rows; funding sources in columns. The empty cells are your real gap — usually a third of what the sticker price suggested.',
        zh: '在申请前为每个机会做一页资助地图：学费、住宿、机票、签证、保险作为行；资金来源作为列。空白的格子才是你真实的缺口——通常只有标价让你以为的三分之一。',
      },
    ],
  },
  {
    id: 'r6',
    slug: 'impostor-to-evidence',
    category: 'mindset',
    title: {
      en: 'From impostor to evidence: applying while doubting yourself',
      zh: '从冒名顶替到证据思维：一边自我怀疑一边申请',
    },
    excerpt: {
      en: 'Impostor feelings are information, not instruction. A practical protocol for applying anyway — used by first-generation winners.',
      zh: '冒名顶替感是信息，不是指令。一套"照样申请"的实操方案——来自第一代破圈者的经验。',
    },
    readMinutes: 7,
    body: [
      {
        en: 'The feeling that you don’t belong in the applicant pool is near-universal among people who are first in their family or town to apply. It is also statistically uninformative: self-assessed fit predicts selection outcomes worse than a coin flip. Treat the feeling as weather, not as a forecast.',
        zh: '"我不配出现在申请池里"——这种感觉在家里或镇上第一个申请的人中几乎人人都有。但它在统计上毫无信息量：自我评估的匹配度对录取结果的预测力还不如抛硬币。把这种感觉当天气，而不是天气预报。',
      },
      {
        en: 'The evidence protocol: keep a single file. Every time you do the thing — ship the project, get the reply, survive the deadline — one line goes in. When the doubt spikes before submission, you do not argue with it; you read the file. Feelings negotiate; documents don’t.',
        zh: '证据方案：建一个文件。每次你做成一件事——上线项目、收到回复、扛过截止日期——就记一行。提交前自我怀疑爆发时，不要和它辩论；打开文件读。感觉可以讨价还价；文档不会。',
      },
      {
        en: 'And apply on the 70% rule: if you meet seventy percent of the stated criteria, you are in the credible range — selection data across fellowships shows committees routinely choose "grew into it" profiles over "checked every box" ones. The box-checkers wrote safer essays.',
        zh: '执行 70% 法则：满足七成明文条件，你就已经在可信区间内——各类研修金的录取数据显示，评委经常选择"成长型"档案，而不是"每项全勾"的档案。因为全勾的人，文书也写得最保守。',
      },
    ],
  },
];

export function getResource(slug: string): ResourceArticle | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
