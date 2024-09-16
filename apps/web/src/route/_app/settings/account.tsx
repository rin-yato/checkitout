import { createFileRoute } from "@tanstack/react-router";
import { SingleUploadUI } from "@/component/single-upload";
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
import { UploadRoot, UploadTrigger } from "@/component/upload";
import { getFirstUploadedFile, hasPendingFiles } from "@/component/upload/utils";
import { useAuth } from "@/provider/auth.provider";
import { Code, Flex, Heading, Kbd, Separator, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Info } from "@phosphor-icons/react";

export const Route = createFileRoute("/_app/settings/account")({
  component: AccountSettingsPage,
});

const FORM_ID = "account-settings-form";

const schema = z.object({
  displayName: z.string().min(3).max(50),
  address: z.string().min(3).max(50),
  phone: z.string(),
  profile: z.string().min(3).max(50),
});

type Schema = z.infer<typeof schema>;

function AccountSettingsPage() {
  const user = useAuth();

  const [_, setHasPendingFile] = useState(false);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      profile: user.profile ?? undefined,
      displayName: user.displayName,
      address: user.address,
      phone: user.phone,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
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
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem className="flex items-start gap-x-28" direction="row">
                <div className="flex max-w-sm flex-col gap-2 pt-1">
                  <Heading size="4">Profile</Heading>
                  <Text wrap="pretty" color="gray">
                    This will be what people see on the checkout page. It's recommended to use a
                    logo of your brand.
                  </Text>
                </div>

                <UploadRoot
                  dropzoneOpts={{ multiple: false, maxFiles: 1, accept: { "image/*": [] } }}
                  onFileStatesChange={(fileStates) => {
                    field.onChange(getFirstUploadedFile(fileStates)?.data.url);
                    setHasPendingFile(hasPendingFiles(fileStates));
                  }}
                >
                  <Flex className="items-center gap-x-5">
                    <SingleUploadUI label="Upload Profile" className="size-32 bg-gray-2" />
                    <Flex direction="column" gapY="3">
                      <UploadTrigger>
                        <Button color="gray" variant="soft" className="w-fit gap-x-0">
                          Upload profile
                          <Text color="red" as="span">
                            *
                          </Text>
                        </Button>
                      </UploadTrigger>
                      <FormDescription
                        wrap="balance"
                        trim="end"
                        className="max-w-xs leading-snug"
                      >
                        Recommended 260x260, Format png, jpg and jpeg
                      </FormDescription>
                      <FormMessage />
                    </Flex>
                  </Flex>
                </UploadRoot>
              </FormItem>
            )}
          />

          <Separator size="4" className="my-5" />

          <div className="flex items-start gap-x-28">
            <div className="flex max-w-sm flex-col gap-2 pt-1">
              <Heading size="4">General Information</Heading>
              <Text wrap="pretty" color="gray">
                General information about your business. This will be displayed on the receipt
                at the checkout page.
              </Text>
            </div>

            <div className="flex w-full max-w-lg flex-col gap-5">
              <div className="flex gap-x-5">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel required>Display Name</FormLabel>
                      <FormControl>
                        <TextField.Root
                          {...field}
                          size="3"
                          color="gray"
                          variant="soft"
                          className="w-full"
                          placeholder="e.g. Formal Outfits"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel required>Phone Number</FormLabel>
                      <FormControl>
                        <TextField.Root
                          {...field}
                          size="3"
                          color="gray"
                          variant="soft"
                          className="w-full"
                          placeholder="012345678"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel required>Address</FormLabel>
                    <FormControl>
                      <TextField.Root
                        {...field}
                        size="3"
                        color="gray"
                        variant="soft"
                        className="w-full"
                        placeholder="st2002, Teuk Thla, Phnom Penh Thmey, Sen Sok..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator size="4" className="my-5" />

          <div className="flex items-start gap-x-28">
            <div className="flex max-w-sm flex-col gap-2 pt-1">
              <Heading size="4">Bakong KHQR</Heading>
              <Text wrap="pretty" color="gray">
                Your bakong account ID. This will be used to generate&nbsp;
                <Code color="ruby">KHQR</Code> code for receiving payments.
              </Text>
            </div>

            <div className="w-full max-w-lg">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel required>Bakong ID</FormLabel>
                    <FormControl>
                      <TextField.Root
                        {...field}
                        size="3"
                        color="gray"
                        variant="soft"
                        className="w-full"
                        placeholder="checkitout@aclb"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription className="flex items-center gap-1">
                      <Info size={18} />
                      <span>Steps for checking Bakong ID</span>
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-10">
            <Button variant="soft" color="gray" type="reset" size="3">
              Discard Changes
            </Button>
            <Button type="submit" size="3">
              Save Changes
              <Check size={16} weight="bold" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
