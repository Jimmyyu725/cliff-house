import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cliff-house-jingtian.jaywhyyyy.chatgpt.site'),
  title: '崖居 · CLIFF HOUSE | 在世界边缘，安放日常',
  description: '一间悬崖边的小房子，一场面向海的建筑白日梦。探索日光、日落与蓝调氛围，让自然成为空间的主角。',
  icons: { icon: '/favicon.svg' },
  openGraph: { title: '崖居 · CLIFF HOUSE', description: '在世界边缘，安放日常。', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: '崖居 · CLIFF HOUSE', description: '在世界边缘，安放日常。', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
