import { useState } from 'react';
import { useTripMembers, useRemoveTripMember } from '@/hooks/useCollaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserMinus, Crown } from 'lucide-react';

interface CollaborationSectionProps {
  tripId: string;
  isOwner: boolean;
}

export function CollaborationSection({ tripId, isOwner }: CollaborationSectionProps) {
  const { data: members, isLoading } = useTripMembers(tripId);
  const removeMember = useRemoveTripMember();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Users className='h-5 w-5' />
          Thanh vien ({members?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className='text-sm text-muted-foreground'>Dang tai...</p>
        ) : members && members.length > 0 ? (
          <div className='space-y-3'>
            {members.map((member: any) => (
              <div key={member.id} className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage src={member.profile?.avatar_url || undefined} />
                  <AvatarFallback>{getInitials(member.profile?.full_name)}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{member.profile?.full_name || 'Thanh vien'}</p>
                  <Badge variant={member.role === 'leader' ? 'default' : 'secondary'} className='text-xs'>
                    {member.role === 'leader' ? <><Crown className='h-3 w-3 mr-1' /> Leader</> : 'Thanh vien'}
                  </Badge>
                </div>
                {isOwner && member.role !== 'leader' && (
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8'
                    onClick={() => removeMember.mutate({ memberId: member.id, tripId })}
                  >
                    <UserMinus className='h-4 w-4 text-destructive' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-muted-foreground text-center py-4'>Chua co thanh vien nao</p>
        )}
      </CardContent>
    </Card>
  );
}

