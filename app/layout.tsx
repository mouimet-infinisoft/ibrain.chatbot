import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { Public_Sans } from "next/font/google";

// import { Navbar } from "@/components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // if (typeof window !== "undefined") {
  //   const _nlp = (window as any)?.nlpjs;
  //   //@ts-ignore
  //   async function init() {
  //     let container = await _nlp?.containerBootstrap();
  //     container.use(_nlp?.Nlp);
  //     container.use(_nlp?.LangEn);
  //     const nlp = container.get("nlp");
  //     nlp.settings.autoSave = false;
  //     nlp.addLanguage("en");
  //     // Adds the utterances and intents for the NLP
  //     nlp.addDocument("en", "goodbye for now", "greetings.bye");
  //     nlp.addDocument("en", "bye bye take care", "greetings.bye");
  //     nlp.addDocument("en", "okay see you later", "greetings.bye");
  //     nlp.addDocument("en", "bye for now", "greetings.bye");
  //     nlp.addDocument("en", "i must go", "greetings.bye");
  //     nlp.addDocument("en", "hello", "greetings.hello");
  //     nlp.addDocument("en", "hi", "greetings.hello");
  //     nlp.addDocument("en", "howdy", "greetings.hello");

  //     // Train also the NLG
  //     nlp.addAnswer("en", "greetings.bye", "Till next time");
  //     nlp.addAnswer("en", "greetings.bye", "see you soon!");
  //     nlp.addAnswer("en", "greetings.hello", "Hey there!");
  //     nlp.addAnswer("en", "greetings.hello", "Greetings!");
  //     await nlp.train();
  //     const response = await nlp.process("en", "im leaving soon");
  //     console.log(response);
  //   }

  //   init()
  //   .then(()=>{console.log(`initialized`)})
  //   .catch(()=>{console.error(`error initializing`)})
  // }

  return (
    <html lang="en">
      <head>
        <title>iBrain Chatbot</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="description" content="iBrain AI Companion" />
        <meta property="og:title" content="iBrain Chatbot" />
        <meta property="og:description" content="iBrain AI Companion" />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="iBrain AI Companion" />
        <meta name="twitter:description" content="iBrain AI Companion" />
        <meta name="twitter:image" content="/images/og-image.png" />
        <script src="/assets/js/bundle.js"></script>
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">
          <Navbar></Navbar>
          {children}
        </div>
        <script src="/bundle.js" defer></script>
      </body>
    </html>
  );
}
