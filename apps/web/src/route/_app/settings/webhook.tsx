import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/component/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/component/ui/form";
import { useAuth } from "@/provider/auth.provider";
import { Heading, Separator, Spinner, Switch, Text, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import { confirmation } from "@/lib/confirmation";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/_app/settings/webhook")({
  component: WebhookSettingsPage,
});

const FORM_ID = "webhook-settings-form";

const webhookFormSchema = z.object({
  url: z.string().url(),
  allowRetry: z.boolean({ coerce: true }),
  waitBeforeRedirect: z.boolean({ coerce: true }),
});

type WebhookForm = z.infer<typeof webhookFormSchema>;

function WebhookSettingsPage() {
  const _user = useAuth();

  const form = useForm<WebhookForm>({
    resolver: zodResolver(webhookFormSchema),
  });

  const onSubmit = async (_data: WebhookForm) => {
    // const updated = await mutateAsync(data).then(ok).catch(err);

    // if (updated.error) {
    //   return toast.error(updated.error.message);
    // }

    toast.success("Webhook updated successfully");
  };

  const handleReset = () => {
    confirmation.create({
      title: "Discard Changes",
      type: "danger",
      description: "Are you sure you want to discard changes?",
      onConfirm: () => form.reset(),
    });
  };

  return (
    <div className="flex flex-1 pb-3">
      <Form {...form}>
        <form
          id={FORM_ID}
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-y-6"
        >
          <div className="flex items-start gap-x-28">
            <div className="flex max-w-sm flex-col gap-2 pt-1">
              <Heading size="4">Webhook Settings</Heading>
              <Text wrap="pretty" color="gray">
                Configure your webhook settings to receive updates on your customer's payment
                status.
              </Text>
            </div>

            <div className="flex w-full max-w-lg flex-col gap-5">
              {/* <div className="flex gap-x-5"> */}
              {/*   <FormField */}
              {/*     control={form.control} */}
              {/*     name="displayName" */}
              {/*     render={({ field }) => ( */}
              {/*       <FormItem className="flex-1"> */}
              {/*         <FormLabel required>Display Name</FormLabel> */}
              {/*         <FormControl> */}
              {/*           <TextField.Root */}
              {/*             {...field} */}
              {/*             size="3" */}
              {/*             color="gray" */}
              {/*             variant="soft" */}
              {/*             className="w-full" */}
              {/*             placeholder="e.g. Formal Outfits" */}
              {/*           /> */}
              {/*         </FormControl> */}
              {/*         <FormMessage /> */}
              {/*       </FormItem> */}
              {/*     )} */}
              {/*   /> */}

              {/*   <FormField */}
              {/*     control={form.control} */}
              {/*     name="phone" */}
              {/*     render={({ field }) => ( */}
              {/*       <FormItem className="flex-1"> */}
              {/*         <FormLabel required>Phone Number</FormLabel> */}
              {/*         <FormControl> */}
              {/*           <TextField.Root */}
              {/*             {...field} */}
              {/*             size="3" */}
              {/*             color="gray" */}
              {/*             variant="soft" */}
              {/*             className="w-full" */}
              {/*             placeholder="012345678" */}
              {/*           /> */}
              {/*         </FormControl> */}
              {/*         <FormMessage /> */}
              {/*       </FormItem> */}
              {/*     )} */}
              {/*   /> */}
              {/* </div> */}

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel required>Webhook URL</FormLabel>
                    <FormControl>
                      <TextField.Root
                        {...field}
                        size="3"
                        color="gray"
                        variant="soft"
                        className="w-full"
                        placeholder="https://your-api.com/checkout/webhook"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Check out our documentation on how to setup your webhook.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator size="4" className="my-5" />

          <div className="flex items-start gap-x-28">
            <div className="flex max-w-sm flex-col gap-2 pt-1">
              <Heading size="4">Wait before redirect</Heading>
              <Text wrap="pretty" color="gray">
                Wait for webhook success response before redirecting the user to the success
                page.
              </Text>
            </div>

            <div className="my-auto w-full max-w-lg">
              <FormField
                name="waitBeforeRedirect"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1 flex-row items-center gap-x-4">
                    <FormControl>
                      <Switch
                        size="3"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                        disabled={field.disabled}
                      />
                    </FormControl>

                    <FormLabel className={cn(!field.value && "text-gray-foreground")}>
                      Wait for webhook
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator size="4" className="my-5" />

          <div className="flex items-start gap-x-28">
            <div className="flex w-full max-w-sm flex-col gap-2 pt-1">
              <Heading size="4">Retry on failure</Heading>
              <Text wrap="pretty" color="gray">
                Enable this setting to retry the webhook request in case of a failure. (Max 5
                retries)
              </Text>
            </div>

            <div className="my-auto w-full max-w-lg">
              <FormField
                name="allowRetry"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1 flex-row items-center gap-x-4">
                    <FormControl>
                      <Switch
                        size="3"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                        disabled={field.disabled}
                      />
                    </FormControl>

                    <FormLabel className={cn(!field.value && "text-gray-foreground")}>
                      Allow Retry
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-10">
            <Button
              variant="soft"
              color="gray"
              size="3"
              onClick={handleReset}
              disabled={form.formState.isSubmitting}
            >
              Discard Changes
            </Button>
            <Button size="3" type="submit" disabled={form.formState.isSubmitting}>
              Save Changes
              <Spinner loading={form.formState.isSubmitting}>
                <Check size={16} weight="bold" />
              </Spinner>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
