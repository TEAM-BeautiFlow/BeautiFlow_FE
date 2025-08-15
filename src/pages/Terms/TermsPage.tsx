import { useNavigate } from "react-router-dom";
import icon_left_chevron from "../../assets/icon_left-chevron.svg";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen min-w-[375px] flex-col items-center justify-center bg-[var(--color-grey-1000)]">
      <div className="relative flex w-full max-w-[375px] flex-grow flex-col overflow-hidden px-5 pt-8 pb-6">
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex w-full items-center">
          <button className="mr-2" onClick={() => navigate(-1)}>
            <img src={icon_left_chevron} alt="뒤로가기" className="h-6 w-6" />
          </button>
          <div className="label1 flex-1 text-center text-[var(--color-white)]">
            이용약관
          </div>
        </div>

        {/* 약관 내용 */}
        <div className="flex-1 overflow-y-auto">
          <div className="body2 space-y-6 text-[var(--color-white)]">
            <div>
              <h1 className="title2 mb-4 text-[var(--color-white)]">
                뷰티플로우 서비스 이용약관
              </h1>
            </div>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                제 1 장 총칙
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 1 조 (목적)
                </h3>
                <p className="leading-relaxed">
                  1. 이 약관은 주식회사 뷰티플로우(이하 '회사')가 제공하는
                  뷰티플로우 예약∙고객관리 서비스(이하 "서비스")의 이용과
                  관련하여 "회사"와 "회원"(제2조에서 정의합니다) 간의 권리, 의무
                  및 책임사항, "회원"의 "서비스" 이용 절차에 관한 사항을
                  규정함을 목적으로 합니다. 이 약관은 "회사"가 제공하는 "서비스"
                  일체에 적용됩니다.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 2 조 (용어의 정의)
                </h3>
                <p className="mb-2">
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                </p>
                <div className="space-y-2 pl-4">
                  <p>
                    1. "서비스"란 "회사"가 제공하는 네일샵에 대한
                    예약∙정보제공∙구매 등을 위한 온라인 플랫폼 서비스를
                    의미합니다. 서비스는 구현되는 장치나 단말기(PC, TV, 휴대형
                    단말기 등의 각종 유무선 장치를 포함하며 이에 한정되지
                    않음)와 상관 없이 보트르내일 관련 웹(Web)∙앱(App) 등의 제반
                    서비스를 의미하며, 회사가 공개한 API를 이용하여 제3자가 개발
                    또는 구축한 프로그램이나 서비스를 통하여 회원에게 제공되는
                    경우를 포함합니다.
                  </p>
                  <p>
                    2. "회원"이란 "서비스"에 접속하여 본 약관에 따라 "회사"와
                    이용계약을 체결하고 "회사"가 제공하는 서비스를 이용하는
                    고객을 말하며, 회원계정(ID/PW)을 생성하지 않은 일반
                    고객(일명 비회원 고객)도 포함됩니다.
                  </p>
                  <p>
                    3. "판매자"이라 함은 "회사"가 제공하는 "서비스"를 이용하여
                    자신의 상품 등을 판매하는 자를 의미하며, 회사로부터
                    예약∙판매 대행, 광고 서비스 등을 제공받는 자를 말합니다
                  </p>
                  <p>
                    4. "게시물"이란 "회원"이 "서비스"를 이용함에 있어 "서비스"
                    상에 게시한 부호, 문자, 음성 형태의 글, 사진, 동영상 및 각종
                    파일과 링크 등을 의미합니다.
                  </p>
                  <p>
                    5. "가입신청인"이라 함은 이 약관에 의하여 "회원"이 되고자
                    하는 사람을 말합니다.
                  </p>
                  <p>
                    6. 본 약관에서 사용하는 용어 중 본 조에서 정하지 아니한
                    사항은 관계 법령에서 정하는 바에 따르며, 그 외에는 일반
                    관례에 따릅니다.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 3 조 (약관의 게시와 개정)
                </h3>
                <div className="space-y-2 pl-4">
                  <p>
                    1. 본 약관은 "회원"이 서비스 가입 및 이용시 열람 할 수
                    있으며, "회사"는 본 약관의 내용을 "회원"이 쉽게 열람할 수
                    있도록 보트르내일(Votrenaeil) 서비스 홈페이지(이하
                    "홈페이지") 또는 연결화면을 통하여 게시합니다.
                  </p>
                  <p>
                    2. "회사"는 『약관의 규제에 관한 법률』, 『전자상거래
                    등에서의 소비자보호에 관한 법률』, 『정보통신망 이용촉진 및
                    정보보호(이하 "정보통신망법"이라 합니다)』,
                    『소비자기본법』, 『전자문서 및 전자거래 기본법』 등
                    관련법에 위배되지 않는 범위 내에서 본 약관을 개정할 수
                    있습니다.
                  </p>
                  <p>
                    3. "회사"는 "약관"을 개정할 경우 개정내용과 적용일자를
                    명시하여 제5조에 따른 방법으로 적용일자 7일 전부터 적용일자
                    전일까지 통지합니다.
                  </p>
                  <p>
                    4. "회사"가 전항에 따라 개정약관을 공지하면서 일정한 기간
                    내에 의사표시를 하지 않으면 의사표시가 표명된 것으로 본다는
                    뜻을 명확하게 공지 또는 통지하였음에도 "회원"이 명시적으로
                    거부의 의사표시를 하지 아니한 경우 개정약관에 동의한 것으로
                    봅니다.
                  </p>
                  <p>
                    5. "회원"은 개정약관에 동의하지 않는 경우에는 개정 약관의
                    적용일 이전에 명시적인 거부 의사를 표시하고 이용계약을
                    해지할 수 있습니다.
                  </p>
                  <p>
                    6. "회원"은 약관 변경에 대하여 주의의무를 다하여야 하며,
                    개정 약관의 부지로 인한 "회원"의 피해는 "회사"가 책임지지
                    않습니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                제 2 장 서비스 이용계약의 체결과 해지
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 6 조 (이용계약의 체결)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 이용계약은 "회원"이 되고자 하는 자(이하 "가입신청자")가
                    약관의 내용에 대하여 동의를 한 다음 "서비스" 이용 신청을
                    하고, "회사"가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
                  </p>
                  <p>
                    2. "회사"는 "가입신청자"의 신청에 대하여 "서비스" 이용을
                    승낙함을 원칙으로 합니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                제 3 장 서비스의 이용
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 8 조 ("서비스"의 내용 및 제공)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. "회사"가 본 약관에 따라 "회원"에게 제공하는 "서비스"는
                    아래 각 호와 같습니다.
                  </p>
                  <div className="space-y-1 pl-4">
                    <p>1) '판매자'의 네일샵 정보 제공 서비스</p>
                    <p>2) '판매자'의 네일샵 예약 서비스</p>
                    <p>
                      3) 기타 "회사"가 추가 개발하거나 다른 회사와의 제휴 계약
                      등을 통해 "회원"에게 제공하는 일체의 서비스
                    </p>
                  </div>
                  <p>
                    2. "회사"는 "서비스"를 연중무휴, 1일 24시간 제공함을
                    원칙으로 합니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                제 4 장 권리와 의무
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 15 조 (회사의 의무)
                </h3>
                <p>
                  1. "회사"는 관련 법령과 이 약관이 금지하거나 공공질서,
                  미풍양속에 반하는 행위를 하지 않으며, 이 약관이 정하는 바에
                  따라 지속적이고 안정적으로 "서비스"를 제공하기 위하여 최선을
                  다합니다.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 16 조 (회원의 의무)
                </h3>
                <p>
                  1. "회원"은 기타 관계 법령, 본 약관의 규정, 이용안내 및
                  서비스상에 공지한 주의사항, "회사"가 통지하는 사항 등을
                  준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는
                  아니 됩니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                제 6 장 기타
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  제 21 조 (준거법 및 재판관할)
                </h3>
                <div className="space-y-2">
                  <p>
                    1. 이 약관과 관련된 사항에 대하여는 대한민국 법을 준거법으로
                    합니다.
                  </p>
                  <p>
                    2. "회사"와 "회원"간 발생한 분쟁에 관한 소송은 민사소송법
                    상의 관할법원에 제소합니다.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-8 border-t border-[var(--color-grey-800)] pt-4">
              <p className="caption1 text-[var(--color-grey-500)]">*부칙</p>
              <p className="caption1 text-[var(--color-grey-500)]">
                이 약관은 2025년 8월 1일 부터 시행합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
