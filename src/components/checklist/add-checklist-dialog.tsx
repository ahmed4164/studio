'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Trash2 } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';


const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  items: z.array(z.object({ value: z.string().min(1, 'Item text cannot be empty') })).min(1, 'At least one item is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface AddChecklistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChecklist: (title: string, items: string[]) => void;
}

export function AddChecklistDialog({ open, onOpenChange, onAddChecklist }: AddChecklistDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      items: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const onSubmit = (data: FormValues) => {
    onAddChecklist(data.title, data.items.map(i => i.value));
    form.reset();
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create New Checklist</DialogTitle>
              <DialogDescription>
                Add a title and at least one item to get started.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="title">Checklist Title</Label>
                    <FormControl>
                      <Input id="title" placeholder="e.g., Q3 Product Launch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label>Checklist Items</Label>
                <ScrollArea className="h-[200px] mt-2 pr-4">
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`items.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input placeholder={`Item ${index + 1}`} {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove item</span>
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </ScrollArea>
                {form.formState.errors.items && !form.formState.errors.items.root && (
                  <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.message}</p>
                )}
                 {form.formState.errors.items?.root && (
                  <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.items.root.message}</p>
                )}
              </div>

              <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-accent hover:bg-accent/90">Create Checklist</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
