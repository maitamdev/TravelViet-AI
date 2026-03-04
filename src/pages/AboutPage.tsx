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


const TECH_STACK = [
  { name: 'React + TypeScript', desc: 'Frontend framework', icon: Code },
  { name: 'Vite', desc: 'Build tool', icon: Sparkles },
  { name: 'Tailwind CSS + shadcn/ui', desc: 'Styling', icon: Heart },
  { name: 'Supabase', desc: 'Backend & Auth', icon: Shield },
  { name: 'Groq API (Llama 3.3)', desc: 'AI Engine', icon: MessageSquare },
  { name: 'Leaflet', desc: 'Maps', icon: Map },
];


export default function AboutPage() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <nav className='flex items-center justify-between px-6 py-4 lg:px-12 border-b'>
        <Link to='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
            <Plane className='h-4 w-4 text-primary-foreground' />
          </div>
          <span className='font-bold text-lg'>TravelViet</span>
        </Link>
        <Button asChild variant='ghost' size='sm'>
          <Link to='/'><ArrowLeft className='h-4 w-4 mr-2' /> Trang chu</Link>
        </Button>
      </nav>

      <main className='container mx-auto px-6 py-12 max-w-4xl space-y-16'>
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
          <h1 className='text-4xl font-bold mb-4'>Ve <span className='text-gradient'>TravelViet AI</span></h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            TravelViet AI la nen tang len ke hoach du lich Viet Nam thong minh, su dung cong nghe AI tien tien de giup ban co nhung chuyen di hoan hao.
          </p>
        </motion.section>

        {/* Mission */}
        <section className='grid md:grid-cols-3 gap-6'>
          {[
            { icon: Sparkles, title: 'Thong minh', desc: 'AI phan tich va toi uu lich trinh dua tren so thich, ngan sach va thoi gian cua ban' },
            { icon: Users, title: 'Cong dong', desc: 'Chia se va kham pha lich trinh tu hang nghin du khach tren khap Viet Nam' },
            { icon: Shield, title: 'An toan', desc: 'Du lieu duoc bao mat tuyet doi voi cong nghe bao mat cap doanh nghiep' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Card className='h-full'>
                <CardContent className='pt-6 text-center'>
                  <div className='icon-badge w-12 h-12 mx-auto mb-4'>
                    <item.icon className='h-6 w-6 text-primary-foreground' />
                  </div>
                  <h3 className='font-semibold text-lg mb-2'>{item.title}</h3>
                  <p className='text-sm text-muted-foreground'>{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8'>Cong nghe su dung</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {TECH_STACK.map((tech, i) => (
              <Card key={i} className='card-hover'>
                <CardContent className='p-4 flex items-center gap-3'>
                  <tech.icon className='h-5 w-5 text-primary' />
                  <div>
                    <p className='font-medium text-sm'>{tech.name}</p>
                    <p className='text-xs text-muted-foreground'>{tech.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2'>
            <HelpCircle className='h-6 w-6' /> Cau hoi thuong gap
          </h2>
          <Accordion type='single' collapsible className='w-full'>
            {FAQ_DATA.map((faq, i) => (
              <AccordionItem key={i} value={'faq-' + i}>
                <AccordionTrigger className='text-left'>{faq.q}</AccordionTrigger>
                <AccordionContent className='text-muted-foreground'>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Contact */}
        <section>
          <h2 className='text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2'>
            <Mail className='h-6 w-6' /> Lien he
          </h2>
          <Card className='max-w-lg mx-auto'>
            <CardContent className='pt-6 space-y-4'>
              <div className='space-y-2'>
                <Label>Ho ten</Label>
                <Input value={contactName} onChange={e => setContactName(e.target.value)} placeholder='Nguyen Van A' />
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input type='email' value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder='email@example.com' />
              </div>
              <div className='space-y-2'>
                <Label>Noi dung</Label>
                <textarea
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder='Noi dung lien he...'
                  className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]'
                />
              </div>
              <Button className='w-full btn-hero'>Gui lien he</Button>
              <p className='text-xs text-muted-foreground text-center'>Hoac email truc tiep: maitamit062005@gmail.com</p>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className='py-8 border-t mt-16'>
        <div className='container mx-auto px-6 text-center'>
          <p className='text-sm text-muted-foreground'>© 2025 TravelViet AI. Made with ❤️ in Vietnam.</p>
        </div>
      </footer>
    </div>
  );
}

