import { Link } from "waku";

export default async function HomePage() {
  return (
    <div>
      <Link to="/about" className="mt-4 inline-block underline">
        About page
      </Link>
    </div>
  );
}

//   return data;
// };

// export const getConfig = async () => {
//   return {
//     render: 'static',
//   } as const;
// };
