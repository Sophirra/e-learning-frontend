import { Button } from "@/components/ui/button.tsx";
import { useUser } from "@/lib/user/UserContext.tsx";
import { Link } from "react-router-dom";

export function UserSheetContentLoggedIn({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const { user, changeRole } = useUser();
  if (!user) return null;
  console.log(user);
  return (
    <div className="mt-4 p-8 flex flex-col gap-4">
      <h3>
        <strong>Name:</strong> {user?.name}
      </h3>
      <h3>
        <strong>Surname:</strong> {user?.surname}
      </h3>
      <h3>
        <strong>Logged as:</strong>{" "}
        {user.activeRole ? user.activeRole : "unknown??"}
        {user.roles.length > 1 && (
          <Button
            className={"ml-8"}
            variant="outline"
            size="sm"
            onClick={() => {
              changeRole(user.roles.filter((r) => r !== user?.activeRole)[0]);
            }}
          >
            Change to {user.roles.filter((r) => r !== user?.activeRole)}
          </Button>
        )}
      </h3>
      <Button variant="default">
        <Link key={"home"} to={"/home"}>
          To your courses
        </Link>
      </Button>
      <Button variant="secondary">Edit your data</Button>
      <Button variant="destructive" onClick={onLogout}>
        Log out
      </Button>
    </div>
  );
}
