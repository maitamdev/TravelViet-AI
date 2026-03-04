import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useBookmarks, useToggleBookmark } from '@/hooks/useBookmarks';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Bookmark, MapPin, ExternalLink, BookmarkX } from 'lucide-react';
import { Link } from 'react-router-dom';

