import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, ArrowLeft, Sparkles, Map, Users, Shield, Code, Heart, MessageSquare, HelpCircle, Mail } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQ_DATA = [
  { q: 'TravelViet AI la gi?', a: 'TravelViet AI la tro ly du lich thong minh su dung cong nghe AI de giup ban len ke hoach du lich Viet Nam mot cach toi uu va ca nhan hoa.' },
  { q: 'TravelViet AI co mien phi khong?', a: 'Co! TravelViet AI hoan toan mien phi cho nguoi dung ca nhan. Ban co the tao lich trinh, su dung AI planner va chia se lich trinh voi cong dong.' },
  { q: 'AI tao lich trinh nhu the nao?', a: 'AI su dung mo hinh Llama 3.3 70B thong qua Groq API de phan tich thong tin chuyen di cua ban (diem den, ngan sach, thoi gian, so thich) va tao lich trinh chi tiet voi thoi gian, dia diem, chi phi cu the.' },
  { q: 'Toi co the chia se lich trinh khong?', a: 'Co! Ban co the tao link chia se cho bat ky chuyen di nao va dang lich trinh len cong dong de nguoi khac tham khao.' },
  { q: 'Du lieu cua toi co an toan khong?', a: 'Du lieu duoc bao mat boi Supabase voi Row Level Security (RLS). Chi ban moi co quyen truy cap du lieu cua minh.' },
  { q: 'TravelViet AI ho tro nhung tinh thanh nao?', a: 'TravelViet AI ho tro tat ca 63 tinh thanh tren toan Viet Nam, tu Ha Giang den Ca Mau.' },
  { q: 'Toi co the du lich nhom khong?', a: 'Co! Ban co the tao chuyen di nhom, moi thanh vien, binh chon, binh luan va phan cong cong viec cho nhom.' },
  { q: 'Lam sao de lien he ho tro?', a: 'Ban co the gui email den maitamit062005@gmail.com hoac tao issue tren GitHub.' },
];

