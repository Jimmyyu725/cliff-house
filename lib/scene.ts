export const scenes = {
  day: { label: '日光', filter: 'brightness(1.18) saturate(0.75) contrast(0.94)' },
  golden: { label: '日落', filter: 'brightness(1) saturate(1.08)' },
  blue: { label: '蓝调', filter: 'brightness(0.62) saturate(0.65) hue-rotate(12deg)' },
} as const;
export type SceneKey = keyof typeof scenes;
