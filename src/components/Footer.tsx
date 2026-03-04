import { Link } from 'react-router-dom';
import { Plane, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t bg-muted/30 py-8 mt-auto'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <div className='h-7 w-7 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
                <Plane className='h-3.5 w-3.5 text-primary-foreground' />
              </div>
              <span className='font-bold'>TravelViet AI</span>
            </div>
            <p className='text-sm text-muted-foreground'>AI-powered Vietnam travel planner. Kham pha Viet Nam cung AI.</p>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Links</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li><Link to='/about' className='hover:text-foreground'>Gioi thieu</Link></li>
              <li><Link to='/privacy' className='hover:text-foreground'>Chinh sach bao mat</Link></li>
              <li><Link to='/terms' className='hover:text-foreground'>Dieu khoan su dung</Link></li>
            </ul>
          </div>
          <div>
            <h3 className='font-semibold mb-3'>Lien he</h3>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li className='flex items-center gap-2'><Mail className='h-4 w-4' /> maitamit062005@gmail.com</li>
              <li className='flex items-center gap-2'><Github className='h-4 w-4' /> <a href='https://github.com/maitamdev' className='hover:text-foreground'>maitamdev</a></li>
            </ul>
          </div>
        </div>
        <div className='mt-8 pt-4 border-t text-center text-xs text-muted-foreground'>
          &copy; 2025 TravelViet AI by maitamdev. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
