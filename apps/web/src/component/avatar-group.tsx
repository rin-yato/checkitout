import { Avatar, Flex, type AvatarProps } from "@radix-ui/themes";
import { useId } from "react";

interface AvatarGroupProps {
  avatars: AvatarProps[];
  className?: string;
}

export function AvatarGroup(props: AvatarGroupProps) {
  const id = useId();

  return (
    <Flex className={props.className}>
      {props.avatars.slice(0, 2).map((avatar, index) => (
        <Avatar
          key={`${avatar.src}-${avatar.alt}-${index}-${id}`}
          color="gray"
          radius="full"
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          className="-ml-3 border-2 first:ml-0"
        />
      ))}

      {props.avatars.length > 2 && (
        <Avatar
          color="gray"
          radius="full"
          alt="More items"
          fallback={`+${props.avatars.length - 2}`}
          className="-ml-3 border-2"
        />
      )}
    </Flex>
  );
}
