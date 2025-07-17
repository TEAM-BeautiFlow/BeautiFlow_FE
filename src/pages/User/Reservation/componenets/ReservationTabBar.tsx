type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const tabs = ["예정", "완료", "취소"];

export default function ReservationTabBar({ activeTab, setActiveTab }: Props) {
  // const [activeTab, setActiveTab] = useState("예정");
  //   const tabs = ["예정", "완료", "취소"];

  return (
    <div className="">
      <div className="relative h-[36px] py-[3px]">
        <div className="flex gap-4 border-b border-[var(--color-grey-750)] px-5">
          {tabs.map(tab => (
            <button
              onClick={() => setActiveTab(tab)}
              className={`h1 flex h-[36px] w-[43px] cursor-pointer items-center justify-center transition-colors duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-[var(--color-grey-150)] text-[var(--color-grey-150)]"
                  : "text-[var(--color-grey-750)] hover:text-[var(--color-grey-150)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
