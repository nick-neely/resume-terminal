'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquareIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function FeedbackForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Implement your form submission logic here
      console.log(values);
      toast.success('Feedback submitted successfully!');
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start" size="default">
          <MessageSquareIcon className="w-4 h-4 mr-2" />
          <span className="text-base">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-zinc-100 text-xl">Send Feedback</DialogTitle>
          <DialogDescription className="text-zinc-400 text-base">
            Share your thoughts or get in touch directly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200 text-base">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 h-12 px-4 text-base
                      hover:bg-zinc-800/70 focus:bg-zinc-800/70 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200 text-base">Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Feedback subject"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 h-12 px-4 text-base
                      hover:bg-zinc-800/70 focus:bg-zinc-800/70 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200 text-base">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message..."
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[120px] p-4 text-base
                      hover:bg-zinc-800/70 focus:bg-zinc-800/70 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Send Feedback
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
