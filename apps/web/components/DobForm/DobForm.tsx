import * as React from 'react';
import { format } from 'date-fns';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form';

import { cn } from '@workspace/ui/lib/utils';
import { Calendar } from '@workspace/ui/components/calendar';
import { Button } from '@workspace/ui/components/button';
import { FormSchema } from '../../app/utils';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';

export type DobFormProps = {
  dateRange: { from?: Date; to?: Date };
  setDateRange: React.Dispatch<
    React.SetStateAction<{ from?: Date | undefined; to?: Date | undefined }>
  >;
};

export const DobForm: React.FC<DobFormProps> = ({
  dateRange,
  setDateRange,
}) => {
  const handleReset = () => {
    form.reset();
    setDateRange({});
  };
  const onSubmit = (data: { dob: { from?: Date; to?: Date } }) => {
    setDateRange({ from: data.dob.from, to: data.dob.to });
  };

  const form = useForm<{
    dob: { from?: Date; to?: Date };
  }>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dob: { from: undefined, to: undefined },
    },
  });
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mb-5">
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
                          !field.value && 'text-muted-foreground',
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
                        <FaRegCalendarAlt className="ml-auto h-4 w-4 opacity-50" />
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
          <div className="flex justify-center gap-5 mb-4">
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
