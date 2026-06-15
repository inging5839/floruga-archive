/** 병풍 패널 스토리 텍스트 (input/bp_story/story.json 과 동기화) */
export const BP_STORY_TEXTS: Record<string, string> = {
  I: "옛날 옛적, 앞을 보지 못하는 심봉사가 개천에 빠지고 말았어요. 그를 구해준 스님은 말했지요. “공양미 삼백 석을 바치면 눈을 뜰 수 있을 것이오.”",
  "1A": "깊고 어두운 인당수 배 위에서, 뱃사람이 결국 심청이를 바다로 밀어버렸어요",
  "1B": "깊고 어두운 인당수 배 위, 뱃사람이 심청이가 아닌 동료를 밀어버렸어요",
  "1C": "깊고 어두운 인당수 배 위, 심청이는 스스로 바다에 몸을 던졌어요",
  "2A": "용왕은 심청이를 다시 연꽃에 태워 지상으로 돌려보내기로 했어요",
  "2B": "용왕은 낯선 인간을 물리치려 달려들었어요",
  "2C": "용왕은 심청이를 보고 한 눈에 반해 무릎을 꿇고 청혼을 했어요",
  "3-1A": "심청이가 지상에 도착하자, 뱃사람들이 다가왔어요. 심청이는 뱃사람들을 피해 몸을 숨겼어요",
  "3-1B": "뱃사람들은 지상으로 돌아온 심청이를 궁궐로 데려갔어요",
  "3-2A": "심청이는 용왕의 고백들 받아줬어요, 용궁은 축복으로 가득 찼어요",
  "3-2B": "심청이는 용왕의 고백들 받아주지 않고 못마땅한 표정으로 용왕을 바라봤어요",
  "4-1A": "뺑덕어미는 집에 돌아온 심청이를 못마땅하게 보고 집에서 내쫓았어요",
  "4-1B": "심봉사와 뺑덕어미는 집에 돌아온 심청을 보고 깜짝 놀랐어요",
  "4-2A": "심봉사는 궁궐안 잔치 소리가 나는 것을 듣고 따라가보기로 했어요",
  "4-2B": "심봉사는 궁궐 앞 군중에 밀려 넘어졌어요",
  "4-3A": "심청이의 어머니는, 용왕과 심청이 함께 있는 것을 보고 분노해 용왕에게 달려들었어요",
  "4-3B": "심청엄마는 용왕과 심청이가 행복하게 지내는 모습을 뿌듯하게 바라봤어요",
  E1: "뺑덕어미는 심청이를 뒷간에 가뒀어요, 심봉사는 심청이가 갇혀있는 것을 모른채 딸을 그리워하며 하루하루 살아갔답니다",
  E2: "심청이와 심봉사, 뺑덕어미는 한 지붕 아래에서 행복하게 살게 되었어요, 하지만 뺑덕어미는 어딘가 수상한 표정을 짓고 있었답니다.",
  E3: "황제는 심봉사를 위해 궁 안에 머물 곳을 마련해줬어요, 그곳에서 심청이와 심봉사는 행복한 날들을 보내게 되었답니다",
  E4: "심봉사는 곁에 놓여있던 횃불을 들더니, 궁궐 잔치 한 가운데로 던져버렸어요, 궁궐은 순식간에 거센 불길에 휩싸였답니다",
  E5: "심청이는 눈을 번쩍 뜨며 꿈에서 깨어났어요, 온몸은 식은땀으로 젖어 있었죠. 그때, 밖에서 누군가 문을 두드렸습니다. \"심청아, 인당수로 갈 준비는 되었니?\"",
  E6: "용왕은 심봉사를 데려와 눈을 뜨이게 해주었어요. 심청과 심봉사, 심청엄마는 용궁에서 오래도록 행복하게 살았답니다.",
}

const SCENE_TO_E_STORY_KEY: Record<string, string> = {
  "4-1A": "E1",
  "4-1B": "E2",
  "4-2A": "E3",
  "4-2B": "E4",
  "4-3A": "E5",
  "4-3B": "E6",
}

function eStoryKeyFromFilename(filename?: string | null): string | null {
  const name = filename?.trim() ?? ""
  const m = name.match(/^(E\d+)-1/i)
  return m ? m[1].toUpperCase() : null
}

/** D1 storyText가 없을 때 sceneId·filename으로 스토리 조회 */
export function resolveStoryText(
  sceneId?: string | null,
  filename?: string | null,
  storedStoryText?: string | null,
): string | null {
  const stored = storedStoryText?.trim()
  if (stored) return stored

  const eKey = eStoryKeyFromFilename(filename)
  if (eKey && BP_STORY_TEXTS[eKey]) return BP_STORY_TEXTS[eKey]

  const sid = sceneId?.trim()
  if (!sid) return null
  if (sid === "Intro") return BP_STORY_TEXTS.I ?? null
  if (BP_STORY_TEXTS[sid]) return BP_STORY_TEXTS[sid]

  const endingKey = SCENE_TO_E_STORY_KEY[sid]
  if (endingKey) return BP_STORY_TEXTS[endingKey] ?? null

  return null
}
