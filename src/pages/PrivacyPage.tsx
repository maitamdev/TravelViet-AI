import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
          <Shield className='h-8 w-8 text-primary' />
          <h1 className='text-3xl font-bold'>Chinh sach bao mat</h1>
        </div>
        <Card><CardContent className='prose dark:prose-invert p-6 space-y-4'>
          <h2 className='text-xl font-semibold'>1. Thu thap thong tin</h2>
          <p className='text-muted-foreground'>Chung toi thu thap thong tin ca nhan khi ban dang ky tai khoan, bao gom: ho ten, email, thanh pho. Thong tin chuyen di va lich trinh duoc luu tru de phuc vu trai nghiem cua ban.</p>
          <h2 className='text-xl font-semibold'>2. Su dung thong tin</h2>
          <p className='text-muted-foreground'>Thong tin duoc su dung de: cung cap dich vu AI planner, ca nhan hoa goi y, va cai thien trai nghiem nguoi dung. Chung toi khong ban thong tin cho ben thu ba.</p>
          <h2 className='text-xl font-semibold'>3. Bao mat du lieu</h2>
          <p className='text-muted-foreground'>Du lieu duoc bao ve boi Supabase voi Row Level Security (RLS). Tat ca ket noi duoc ma hoa SSL/TLS. Chi ban moi co quyen truy cap du lieu cua minh.</p>
          <h2 className='text-xl font-semibold'>4. Quyen cua ban</h2>
          <p className='text-muted-foreground'>Ban co quyen xem, chinh sua, va xoa du lieu ca nhan bat cu luc nao thong qua trang Cai dat. Lien he maitamit062005@gmail.com de yeu cau xoa tai khoan.</p>
        </CardContent></Card>
      </main>
    </div>
  );
}
