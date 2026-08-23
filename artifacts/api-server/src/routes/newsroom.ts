import { Router, type IRouter } from "express";
import {
  GetArticleParams,
  GetArticlesResponse,
  GetArticleResponse,
  GetSavedArticlesQueryParams,
  GetSavedArticlesResponse,
  GetTopicsResponse,
  SaveArticleParams,
  SaveArticleQueryParams,
  UnsaveArticleParams,
  UnsaveArticleQueryParams,
} from "@workspace/api-zod";

type Article = {
  id: string;
  title: string;
  summary: string;
  body: string;
  topic: string;
  topicLabel: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  readTime: number;
  qualityScore: number;
  accent: string;
  keyPoints: string[];
};

const articles: Article[] = [
  {
    id: "focus-reset",
    title: "အာရုံစူးစိုက်မှု ပြန်တည်ဆောက်ဖို့ ၂ မိနစ်နည်းလမ်း",
    summary: "စာဖတ်နေစဉ် အာရုံပြတ်သွားတဲ့အခါ အလုပ်ကို မပျက်စေဘဲ ပြန်ဝင်နိုင်တဲ့ လွယ်ကူသော routine တစ်ခု။",
    body: "စာဖတ်နေတုန်း ဖုန်းသံ၊ အတွေးတစ်ခု၊ ဒါမှမဟုတ် ပတ်ဝန်းကျင်ကြောင့် အာရုံပြတ်သွားတာ သဘာဝပါ။ အရေးကြီးတာက အာရုံပြတ်သွားတာကို ကိုယ့်အပေါ် အပြစ်တင်မနေဘဲ ပြန်ဝင်ဖို့ အချက်ပြတစ်ခုအဖြစ် အသုံးချတာပါ။\n\nပထမဆုံး စာအုပ်ပေါ်ကနေ မျက်လုံးကို ခဏခွာပြီး အသက်ရှူသွင်း၊ ရှူထုတ် သုံးကြိမ်လုပ်ပါ။ ပြီးရင် လက်ရှိဖတ်နေတဲ့စာပိုဒ်ရဲ့ အဓိကအကြောင်းကို စကားလုံး ၅ လုံးအောက်နဲ့ ကိုယ့်ဘာသာ ပြန်ပြောပါ။ နောက်ဆုံးမှာ နောက်ထပ် ၂ မိနစ်ပဲ ဆက်ဖတ်မယ်လို့ သတ်မှတ်ပြီး စတင်ပါ။ စတင်ပြီးသွားရင် ဆက်လက်ဖတ်နိုင်တာ ပိုလွယ်လာပါလိမ့်မယ်။",
    topic: "focus",
    topicLabel: "အာရုံစူးစိုက်မှု",
    sourceName: "Learning Scientists",
    sourceUrl: "https://www.learningscientists.org/blog/2018/9/6-1",
    publishedAt: "2026-08-22T06:30:00.000Z",
    readTime: 3,
    qualityScore: 94,
    accent: "coral",
    keyPoints: ["အာရုံပြတ်တာကို သဘာဝအဖြစ် လက်ခံပါ", "အသက်ရှူသုံးကြိမ်နဲ့ စိတ်ကို ပြန်တည်ငြိမ်စေပါ", "၂ မိနစ်စာ ရည်မှန်းချက်သေးသေးနဲ့ ပြန်စပါ"],
  },
  {
    id: "active-recall",
    title: "ပြန်ဖတ်တာထက် ကိုယ့်ကိုယ်ကို မေးတာ ပိုမှတ်မိစေတယ်",
    summary: "Active recall ကို စာသင်ခန်းထဲမှာသာမက ကိုယ့်ရဲ့နေ့စဉ်စာကျက်ချိန်မှာ အသုံးချနိုင်တဲ့ နည်းလမ်းများ။",
    body: "စာအုပ်ကို ထပ်ခါထပ်ခါ ပြန်ဖတ်ခြင်းက ရင်းနှီးသလို ခံစားရစေပေမယ့် တကယ်မှတ်မိနေပြီလို့ မဆိုလိုပါဘူး။ စာအုပ်ပိတ်ပြီး မေးခွန်းထုတ်ကာ ကိုယ့်မှတ်ဉာဏ်ထဲကနေ ပြန်ဖြေခြင်းက ပိုမိုခိုင်မာတဲ့ မှတ်ဉာဏ်လမ်းကြောင်းကို ဖန်တီးပေးပါတယ်။\n\nအခန်းတစ်ခန်းပြီးတိုင်း “အဓိကအချက်သုံးခုက ဘာလဲ”၊ “ဒါကို သူငယ်ချင်းတစ်ယောက်ကို ဘယ်လိုရှင်းပြမလဲ” ဆိုတဲ့ မေးခွန်းတွေကို စာအုပ်မကြည့်ဘဲ ဖြေကြည့်ပါ။ မဖြေနိုင်တဲ့နေရာကိုပဲ ပြန်ဖတ်ပြီး ထပ်မေးပါ။ ဒီလိုလုပ်ခြင်းက စာကျက်ချိန်ကို ပိုထိရောက်စေပါတယ်။",
    topic: "memory",
    topicLabel: "မှတ်ဉာဏ်",
    sourceName: "The Learning Scientists",
    sourceUrl: "https://www.learningscientists.org/learning-scientists-blog/2016/6/23-1",
    publishedAt: "2026-08-21T08:00:00.000Z",
    readTime: 4,
    qualityScore: 96,
    accent: "teal",
    keyPoints: ["စာအုပ်ပိတ်ပြီး ပြန်ဖြေပါ", "မေးခွန်းကို ကိုယ့်ဘာသာ ဖန်တီးပါ", "မသိတဲ့အချက်ကိုသာ ပြန်လေ့လာပါ"],
  },
  {
    id: "spaced-repetition",
    title: "စာမေးပွဲနီးမှ အလုအယက်မဟုတ်ဘဲ အချိန်ခွဲပြီး ပြန်လေ့လာပါ",
    summary: "Spaced repetition က အချက်အလက်တွေကို ရေရှည်မှတ်မိအောင် ကူညီပေးတဲ့ အခြေခံမူနဲ့ လက်တွေ့အသုံးချနည်း။",
    body: "တစ်ရက်တည်း အချိန်အများကြီးထိုင်ပြီး စာကျက်တာထက် သင်ယူထားတဲ့အကြောင်းအရာကို အချိန်ကာလခြားပြီး ပြန်လည်ခေါ်ယူတာက ရေရှည်မှတ်ဉာဏ်အတွက် ပိုကောင်းပါတယ်။ ဒီနည်းက မေ့လုနီးပါးအချိန်မှာ ပြန်လည်ခေါ်ယူစေတဲ့အတွက် မှတ်ဉာဏ်ကို ပိုခိုင်မာစေပါတယ်။\n\nဒီနေ့သင်တာကို မနက်ဖြန် ၁၀ မိနစ်၊ သုံးရက်အကြာ ၁၀ မိနစ်၊ တစ်ပတ်အကြာ ၁၀ မိနစ် ပြန်မေးကြည့်ပါ။ Flashcard သုံးရင် အဖြေကို ချက်ချင်းဖတ်မယ့်အစား အရင်ဆုံး ကိုယ့်ဘာသာ ပြန်ဖြေပြီးမှ စစ်ပါ။",
    topic: "memory",
    topicLabel: "မှတ်ဉာဏ်",
    sourceName: "Dunlosky et al.",
    sourceUrl: "https://journals.sagepub.com/doi/10.1177/1529100612453266",
    publishedAt: "2026-08-20T09:15:00.000Z",
    readTime: 4,
    qualityScore: 91,
    accent: "violet",
    keyPoints: ["ပြန်လေ့လာချိန်ကို ခွဲထားပါ", "မေ့လုနီးပါးမှာ ပြန်ခေါ်ယူပါ", "ပြန်ဖတ်တာထက် ပြန်ဖြေတာကို ဦးစားပေးပါ"],
  },
];

const savedByReader = new Map<string, Set<string>>();
const router: IRouter = Router();

router.get("/articles", (_req, res) => {
  res.json(GetArticlesResponse.parse(articles));
});

router.get("/articles/:id", (req, res) => {
  const params = GetArticleParams.parse(req.params);
  const article = articles.find((item) => item.id === params.id);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  res.json(GetArticleResponse.parse(article));
});

router.get("/saved", (req, res) => {
  const { readerId } = GetSavedArticlesQueryParams.parse(req.query);
  const savedIds = savedByReader.get(readerId) ?? new Set<string>();
  res.json(GetSavedArticlesResponse.parse(articles.filter((article) => savedIds.has(article.id))));
});

router.put("/saved/:id", (req, res) => {
  const { id } = SaveArticleParams.parse(req.params);
  const { readerId } = SaveArticleQueryParams.parse(req.query);
  if (!articles.some((article) => article.id === id)) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  const saved = savedByReader.get(readerId) ?? new Set<string>();
  saved.add(id);
  savedByReader.set(readerId, saved);
  res.status(204).send();
});

router.delete("/saved/:id", (req, res) => {
  const { id } = UnsaveArticleParams.parse(req.params);
  const { readerId } = UnsaveArticleQueryParams.parse(req.query);
  savedByReader.get(readerId)?.delete(id);
  res.status(204).send();
});

router.get("/topics", (_req, res) => {
  const counts = new Map<string, { id: string; label: string; count: number }>();
  for (const article of articles) {
    const existing = counts.get(article.topic);
    counts.set(article.topic, existing ? { ...existing, count: existing.count + 1 } : { id: article.topic, label: article.topicLabel, count: 1 });
  }
  res.json(GetTopicsResponse.parse([...counts.values()]));
});

export default router;