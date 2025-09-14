'use client';
import React, { useEffect, useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '@workspace/ui/lib/utils';
import { generateUsers } from './utils/generateUsers';

const FormSchema = z.object({
  dob: z.object({
    from: z.date({
      required_error: 'A start date is required.',
    }),
    to: z.date({
      required_error: 'An end date is required.',
    }),
  }),
});

export default function Page() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: { from: undefined, to: undefined },
    },
  });
  const [users, setUsers] = useState<Person[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [allUsers, setAllUsers] = useState<Person[]>([]);

  useEffect(() => {
    const generated = generateUsers();
    setAllUsers(generated);
    setUsers(generated);
  }, []);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      const from = format(dateRange.from, 'yyyy-MM-dd');
      const to = format(dateRange.to, 'yyyy-MM-dd');
      const filteredUsers = allUsers
        .filter((user) => user.dob >= from && user.dob <= to)
        .sort((a, b) => a.dob.localeCompare(b.dob));
      setUsers(filteredUsers);
    } else {
      setUsers(allUsers);
    }
  }, [dateRange]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setDateRange({ from: data.dob.from, to: data.dob.to });
    toast('You submitted the following range', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-svh gap-8">
      <div className="bg-black flex flex-col items-center justify-center gap-4 p-5 m-5 rounded-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex font-bold items-center flex-col">
                  <h1>Filter by date DOB range</h1>
                  <FormLabel>
                    {' '}
                    A list of customers born between two dates.
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3  mx-auto font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value && field.value.from ? (
                            field.value.to ? (
                              `${format(field.value.from, 'PPP')} - ${format(field.value.to, 'PPP')}`
                            ) : (
                              format(field.value.from, 'PPP')
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-5 ">
              <Button className="cursor-pointer" type="submit">
                Submit
              </Button>
              <Button
                className="cursor-pointer"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
        {!!users.length && (
          <Table>
            <TableCaption>
              A list of customers Born between{' '}
              {dateRange.from ? format(dateRange.from, 'PPP') : '...'} and{' '}
              {dateRange.to ? format(dateRange.to, 'PPP') : '...'}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Account #</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.accountNumber}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>{user.location.city}</TableCell>
                  <TableCell className="text-right">
                    £
                    {user.salary.toLocaleString('en-GB', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
