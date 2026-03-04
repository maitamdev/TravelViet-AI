import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VIETNAM_PROVINCES } from '@/lib/constants';


const REGIONS: Record<string, string[]> = {
  'Bac': ['Ha Noi', 'Ha Giang', 'Cao Bang', 'Bac Kan', 'Tuyen Quang', 'Lao Cai', 'Dien Bien', 'Lai Chau', 'Son La', 'Yen Bai', 'Hoa Binh', 'Thai Nguyen', 'Lang Son', 'Quang Ninh', 'Bac Giang', 'Phu Tho', 'Vinh Phuc', 'Bac Ninh', 'Hai Duong', 'Hai Phong', 'Hung Yen', 'Thai Binh', 'Ha Nam', 'Nam Dinh', 'Ninh Binh'],
  'Trung': ['Thanh Hoa', 'Nghe An', 'Ha Tinh', 'Quang Binh', 'Quang Tri', 'Thua Thien Hue', 'Da Nang', 'Quang Nam', 'Quang Ngai', 'Binh Dinh', 'Phu Yen', 'Khanh Hoa', 'Ninh Thuan', 'Binh Thuan', 'Kon Tum', 'Gia Lai', 'Dak Lak', 'Dak Nong', 'Lam Dong'],
  'Nam': ['Binh Phuoc', 'Tay Ninh', 'Binh Duong', 'Dong Nai', 'Ba Ria - Vung Tau', 'TP. Ho Chi Minh', 'Long An', 'Tien Giang', 'Ben Tre', 'Tra Vinh', 'Vinh Long', 'Dong Thap', 'An Giang', 'Kien Giang', 'Can Tho', 'Hau Giang', 'Soc Trang', 'Bac Lieu', 'Ca Mau'],
};

