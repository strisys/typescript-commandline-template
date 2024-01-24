# LangChain Trials

### References

- [Tutorial](https://js.langchain.com/docs/get_started/quickstart)
- [LangSmith](https://smith.langchain.com/o/714f0f6e-4bcf-5d68-bac9-a66b2a4643b2/)

### Things to Look into

- [Model I/O](https://js.langchain.com/docs/modules/model_io)
- [Retrieval](https://js.langchain.com/docs/modules/data_connection/)
  - [Retrievers](https://js.langchain.com/docs/modules/data_connection/retrievers/) - There is one for [pdf](https://js.langchain.com/docs/modules/data_connection/document_loaders/pdf).  The quickstart uses [Cheerio](https://github.com/cheeriojs/cheerio) for [HTML](https://js.langchain.com/docs/get_started/quickstart#retrieval-chain)
  - [Text Embedding Models](https://js.langchain.com/docs/modules/data_connection/text_embedding)

### Summary

Think of the things necessary to query a relational database.  You have the data itself structured in a relational form with SQL as the instruction and a client used to pass that instruction.   With large language models the data can come in many forms one of which is text and its best to give that structure in a vector database.  The prompt is effectively SQL submitted using a client.  What is slightly different about LLMs is that the prompt is both the question and the data whereas with a relational model the data is known to the execution engine so it does not have to be submitted per se.

There are plenty of differences but the parity with a relational model for asking questions about data is a good way to start as a means to assemble the parts and pieces used when working with LLMs.   Like a relational model where the primary skill is SQL, with LLMs the primary user skill is prompt engineering.

Lets start with the simplest example where we basically have a client along with a prompt consisting of a simple question.  Note the only mentioned elements we are using are the client and the prompt in the form of text content.

```
  import { ChatOpenAI } from "@langchain/openai";

  const getClient = (): ChatOpenAI => {
    return new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY
    });
  }

  const response = (await chatModel.invoke("what is LangSmith?"));
  console.log(response);
```

We said that the main skill for using LLMs is in the creation of good prompts.  One aspect to doing this is giving the LLM its "role context" (e.g. "you are a savvy banker").  Many times using a template as the means for creating the prompt makes sense because often its a "fill in the blanks" exercise.  Below we use a template passing two name/value tuples.  The first sets the "role context" and the second is the place holder for text input. 

```
  import { ChatPromptTemplate } from "@langchain/core/prompts";

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are a world class technical documentation writer.'],
    ['user', '{input}']
  ]);
```

The next piece of code is where we see the first example of a [chain](https://js.langchain.com/docs/modules/chains/) in LangChain.  The abstraction represents a sequence of calls whether to an LLM, a tool, or a data preprocessing step.  Below we will pipe together the call to the LLM (ChatGPT) and the data processing abstraction for the response which in this case simple converts the response to a string.

```
  const chain = prompt.pipe(getClient()).pipe(new StringOutputParser());

  const response = (await chain.invoke({
    input: text,
  }));

  console.log(response);
```

LangChain has the concept of chains which make more sense as the queries get more complex.
