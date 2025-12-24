'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Platform } from '@/app/types';

const formSchema = z.object({
  appVersion: z.string().min(1, 'App version is required').regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),
  platform: z.enum(['ios', 'android', 'general']),
});

type FormValues = z.infer<typeof formSchema>;

interface AddVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVersion: (appVersion: string, platform: Platform) => void;
}

export function AddVersionDialog({ open, onOpenChange, onAddVersion }: AddVersionDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appVersion: '',
      platform: 'general',
    },
  });

  const onSubmit = (data: FormValues) => {
    onAddVersion(data.appVersion, data.platform as Platform);
    form.reset();
    onOpenChange(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create New Version</DialogTitle>
              <DialogDescription>
                Enter the app version and platform. This will create a new, clean copy of the checklists for testing.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="appVersion"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="appVersion">App Version</Label>
                    <FormControl>
                      <Input id="appVersion" placeholder="e.g., 1.2.3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <Label>Platform</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ios">iOS</SelectItem>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">Create Version</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
