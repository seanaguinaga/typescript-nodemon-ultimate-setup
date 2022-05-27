const TAGS = {
  31279: "Start-up",
  31280: "Growth",
  31281: "Big Tech",
  31282: "Enterprise",
  30310: "Round Team",
  31275: "Product",
  31276: "Engineering",
  31277: "Go-To-Market",
  31278: "Business",
};

const fetch = require("node-fetch");

const { Headers } = require("node-fetch");

const TAGS_BY_ID = {
  "Round Team": 30310,
  Product: 31275,
  Engineering: 31276,
  "Go-To-Market": 31277,
  Business: 31278,
  "Start-up": 31279,
  Growth: 31280,
  "Big Tech": 31281,
  Enterprise: 31282,
};

const input = {
  email: "ryan@round.tech",
  full_name: "Ryan Fuller",
  headline: "CEO at Round",
  bio: "From start-ups to tech giants, Ryan has 20+ years in the industry as an acquired founder/CEO, engineer, PM, and corporate exec. He believes that—with thoughtful leadership—technology can solve the world’s biggest problems.",
  linkedin_url: "https://www.linkedin.com/in/ryantfuller/",
  discipline: ["Business"],
  company_size: ["Start-up", "Growth", "Big Tech"],
  role: "Round Team",
};

const getTagIDs = (data: typeof input) => {
  const tags = data.discipline.concat(data.company_size).concat(data.role);
  console.log(tags);
  //@ts-ignore
  return tags.map((tag) => TAGS_BY_ID[tag]);
};

//@ts-expect-error
function inverse(obj) {
  var retobj = {};
  for (var key in obj) {
    //@ts-ignore
    retobj[obj[key]] = parseInt(key);
  }
  return retobj;
}

console.log(getTagIDs(input));

const output = {
  email: "ryan@round.tech",
  full_name: "Ryan Fuller",
  headline: "CEO at Round",
  bio: "From start-ups to tech giants, Ryan has 20+ years in the industry as an acquired founder/CEO, engineer, PM, and corporate exec. He believes that—with thoughtful leadership—technology can solve the world’s biggest problems.",
  linkedin_url: "https://www.linkedin.com/in/ryantfuller/",
  member_tag_ids: [],
  avatar: "",
};

function makeURL() {}

const myHeaders = new Headers();
myHeaders.append("Authorization", "Token eDPua7n3xfN7FURj1f86VESW");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow" as RequestRedirect,
};

async function updateCirclesUser({ data }: { data: typeof input }) {
  const email = data.email;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Token eDPua7n3xfN7FURj1f86VESW");

  var getRequestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow" as RequestRedirect,
  };

  const searchedUser = await fetch(
    `https://app.circle.so/api/v1/community_members/search?community_id=22210&email=${email}`,
    getRequestOptions
  )
    .then((response) => response.json())
    .then((result) => result as { id: string })
    .catch((error) => console.log("error", error));

  if (searchedUser) {
    const formdata = new FormData();

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata as unknown as undefined,
      redirect: "follow" as RequestRedirect,
    };

    const url = new URL(
      `https://app.circle.so/api/v1/community_members/${searchedUser.id}`
    );

    const { company_size, discipline, role, ...rest } = data;

    const result = (await fetch(
      addSearchParams(url, {
        ...rest,
        member_tag_ids: getTagIDs(data),
      }).toString(),
      requestOptions
    ).then((response) => response.json())) as {
      success: boolean;
      errors?: string;
      user?: unknown;
    };

    if (!result.success || result.errors) {
      throw new Error(result.errors);
    }

    return result.user;
  }
}

const addSearchParams = (url: URL, params: any) =>
  new URL(
    //@ts-expect-error is okay
    `${url.origin}${url.pathname}?${new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...Object.entries(params),
    ]).toString()}`
  );
