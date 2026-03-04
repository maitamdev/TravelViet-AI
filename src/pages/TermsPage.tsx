import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-background'>
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
      <main className='container mx-auto px-6 py-12 max-w-3xl'>
        <div className='flex items-center gap-3 mb-8'>
          <FileText className='h-8 w-8 text-primary' />
          <h1 className='text-3xl font-bold'>Dieu khoan su dung</h1>
        </div>
        <Card><CardContent className='prose dark:prose-invert p-6 space-y-4'>
          <h2 className='text-xl font-semibold'>1. Chap nhan dieu khoan</h2>
          <p className='text-muted-foreground'>Khi su dung TravelViet AI, ban dong y voi cac dieu khoan nay. Neu khong dong y, vui long khong su dung dich vu.</p>
          <h2 className='text-xl font-semibold'>2. Tai khoan nguoi dung</h2>
          <p className='text-muted-foreground'>Ban chiu trach nhiem bao mat tai khoan va mat khau. Moi tai khoan chi duoc su dung boi mot nguoi.</p>
          <h2 className='text-xl font-semibold'>3. Noi dung nguoi dung</h2>
          <p className='text-muted-foreground'>Ban so huu noi dung ban tao ra. Khi chia se cong khai, ban cho phep nguoi khac xem va tham khao lich trinh cua ban.</p>
          <h2 className='text-xl font-semibold'>4. AI Planner</h2>
          <p className='text-muted-foreground'>AI Planner cung cap goi y tham khao. Chung toi khong chiu trach nhiem ve do chinh xac cua thong tin AI tao ra. Vui long kiem tra lai truoc khi su dung.</p>
          <h2 className='text-xl font-semibold'>5. Lien he</h2>
          <p className='text-muted-foreground'>Moi thac mac lien he: maitamit062005@gmail.com</p>
        </CardContent></Card>
      </main>
    </div>
  );
}
