import { useNavigate } from "react-router-dom";
import icon_left_chevron from "../../assets/icon_left-chevron.svg";

export default function PrivacyPage() {
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
            개인정보처리방침
          </div>
        </div>

        {/* 개인정보처리방침 내용 */}
        <div className="flex-1 overflow-y-auto">
          <div className="body2 space-y-6 text-[var(--color-white)]">
            <div>
              <h1 className="title2 mb-4 text-[var(--color-white)]">
                개인정보처리방침
              </h1>
              <p className="leading-relaxed">
                주식회사 뷰티플로우(이하 "회사")는 「개인정보보호법」,
                「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련
                법령을 준수하며, 이용자의 개인정보를 보호하기 위하여 다음과 같이
                개인정보처리방침을 수립·공개합니다. 본 방침은 회사가 제공하는
                뷰티플로우 예약·고객관리 서비스(웹·앱 포함, 이하 "서비스")
                이용에 적용됩니다.
              </p>
            </div>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                1. 개인정보 수집 항목 및 방법
              </h2>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  ① 수집 항목
                </h3>
                <p className="mb-3">
                  회사는 회원가입, 서비스 제공, 고객상담, 마케팅·분석 등을 위해
                  다음과 같은 개인정보를 수집할 수 있습니다.
                </p>

                <div className="space-y-3 pl-4">
                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      1. 회원가입 시
                    </h4>
                    <div className="space-y-1 pl-2">
                      <p>- 필수: 이름, 휴대전화번호, 이메일, 비밀번호</p>
                      <p>- 선택: 프로필 이미지, 닉네임</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      2. 서비스 이용 시
                    </h4>
                    <div className="space-y-1 pl-2">
                      <p>
                        - 예약 정보: 예약 일시, 매장명, 서비스 내용,
                        결제정보(카드사명, 승인번호 등)
                      </p>
                      <p>- 매장과의 소통을 위한 정보: 예약자 이름, 연락처</p>
                      <p>- 결제 및 환불 처리 시 필요한 금융정보</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      3. 자동 수집 항목
                    </h4>
                    <div className="pl-2">
                      <p>
                        - 접속 IP, 쿠키, 서비스 이용기록, 기기정보(OS, 브라우저
                        정보 등), 로그 기록, 광고식별자
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      4. 이벤트 및 마케팅 참여 시
                    </h4>
                    <div className="pl-2">
                      <p>- 이름, 연락처, 주소, SNS 계정 정보(선택)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="label1 mb-2 text-[var(--color-white)]">
                  ② 수집 방법
                </h3>
                <div className="space-y-1 pl-4">
                  <p>- 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력</p>
                  <p>- 고객센터 상담, 이메일·팩스·전화 등을 통한 수집</p>
                  <p>- 제휴사 및 판매자(네일샵)로부터의 제공</p>
                  <p>- 자동 수집 장치를 통한 수집(쿠키, 로그 분석 등)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                2. 개인정보의 수집 및 이용 목적
              </h2>
              <p className="mb-3">
                회사는 수집한 개인정보를 다음의 목적을 위해 사용합니다.
              </p>
              <div className="space-y-1 pl-4">
                <p>
                  1. 서비스 제공: 예약 접수·확정, 결제 및 환불, 매장과의 소통,
                  고객관리
                </p>
                <p>
                  2. 회원 관리: 본인확인, 부정이용 방지, 민원 처리, 고지사항
                  전달
                </p>
                <p>
                  3. 마케팅 및 광고: 신규 서비스 안내, 이벤트 운영, 맞춤형 광고
                  제공
                </p>
                <p>4. 서비스 개선: 서비스 이용 분석, 통계 작성, 기능 개선</p>
                <p>
                  5. 법령 준수: 관계 법령 및 약관에 따른 기록 보존, 분쟁 해결
                </p>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                3. 개인정보의 보유 및 이용 기간
              </h2>
              <div className="space-y-3">
                <p>
                  ① 회사는 원칙적으로 개인정보의 수집·이용 목적이 달성되면 지체
                  없이 파기합니다.
                </p>
                <div>
                  <p className="mb-2">
                    ② 다만, 관련 법령에 따라 다음과 같이 일정 기간 보관합니다.
                  </p>
                  <div className="space-y-1 pl-4">
                    <p>
                      - 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
                    </p>
                    <p>
                      - 대금결제 및 재화 공급에 관한 기록: 5년 (전자상거래법)
                    </p>
                    <p>
                      - 소비자 불만 또는 분쟁처리에 관한 기록: 3년
                      (전자상거래법)
                    </p>
                    <p>- 웹사이트 방문 기록: 3개월 (통신비밀보호법)</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                4. 개인정보의 제3자 제공
              </h2>
              <div className="space-y-3">
                <p>
                  회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지
                  않습니다. 다만, 다음의 경우에는 예외로 합니다.
                </p>
                <div className="space-y-3 pl-4">
                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      1. 서비스 이용에 필요한 범위 내 판매자(네일샵) 제공
                    </h4>
                    <div className="space-y-1 pl-2">
                      <p>- 제공 항목: 예약자 이름, 연락처, 예약 내용</p>
                      <p>
                        - 이용 목적: 예약 확인, 변경·취소 안내, 프로모션 정보
                        발송
                      </p>
                      <p>- 보유·이용 기간: 예약 처리 완료 후 3개월</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      2. 법령 근거 제공
                    </h4>
                    <div className="pl-2">
                      <p>- 법령에 따른 요구, 수사기관 요청 등</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="label2 mb-1 text-[var(--color-white)]">
                      3. 이벤트 운영 시 주최자 제공
                    </h4>
                    <div className="pl-2">
                      <p>
                        - 제공 항목 및 기간은 이벤트 별 사전 고지 및 동의 후
                        제공
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                5. 개인정보의 처리 위탁
              </h2>
              <p className="mb-3">
                회사는 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁할 수
                있습니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border border-[var(--color-grey-650)] text-sm">
                  <thead>
                    <tr className="bg-[var(--color-grey-850)]">
                      <th className="border border-[var(--color-grey-650)] px-3 py-2 text-left">
                        수탁업체
                      </th>
                      <th className="border border-[var(--color-grey-650)] px-3 py-2 text-left">
                        위탁업무
                      </th>
                      <th className="border border-[var(--color-grey-650)] px-3 py-2 text-left">
                        보유·이용기간
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        결제대행사(PG사)
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        결제 처리 및 환불
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        서비스 종료 또는 위탁계약 종료 시
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        문자·푸시 발송 대행사
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        예약 및 알림 발송
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        서비스 종료 또는 위탁계약 종료 시
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        클라우드 서버 운영사
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        데이터 저장 및 관리
                      </td>
                      <td className="border border-[var(--color-grey-650)] px-3 py-2">
                        서비스 종료 또는 위탁계약 종료 시
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                6. 이용자의 권리와 행사 방법
              </h2>
              <div className="space-y-1 pl-4">
                <p>
                  1. 이용자는 언제든지 자신의 개인정보를
                  열람·정정·삭제·처리정지를 요청할 수 있습니다.
                </p>
                <p>
                  2. 회원탈퇴를 요청하면 회사는 관련 법령에 따라 필요한 경우를
                  제외하고 지체 없이 개인정보를 삭제합니다.
                </p>
                <p>
                  3. 권리 행사는 고객센터, 이메일 등을 통해 가능하며, 대리인을
                  통한 행사 시 위임장을 제출해야 합니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                7. 개인정보의 파기 절차 및 방법
              </h2>
              <div className="space-y-1 pl-4">
                <p>
                  1. 파기 절차: 파기 사유가 발생한 개인정보를 선정하고, 개인정보
                  보호책임자의 승인 후 파기
                </p>
                <div>
                  <p>2. 파기 방법:</p>
                  <div className="space-y-1 pl-4">
                    <p>- 전자 파일: 복구 불가능한 기술적 방법으로 삭제</p>
                    <p>- 종이 문서: 분쇄 또는 소각</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                8. 개인정보의 안전성 확보 조치
              </h2>
              <p className="mb-2">
                회사는 개인정보보호법에 따라 다음과 같은 안전성 확보 조치를
                취합니다.
              </p>
              <div className="space-y-1 pl-4">
                <p>- 개인정보 접근 권한 최소화</p>
                <p>- 개인정보 암호화</p>
                <p>- 해킹·바이러스 대비 보안프로그램 설치</p>
                <p>- 접속기록 보관 및 위·변조 방지</p>
                <p>- 물리적 보관 장소의 접근통제</p>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                9. 쿠키(Cookie)의 사용
              </h2>
              <p>
                회사는 맞춤형 서비스 제공을 위해 쿠키를 사용할 수 있습니다.
                이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 거부
                시 일부 서비스 이용에 제한이 있을 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                10. 개인정보 보호책임자
              </h2>
              <div className="space-y-1 pl-4">
                <p>- 성명: 손영이</p>
                <p>- 직책: 개인정보 보호책임자</p>
                <p>- 연락처: 010-6389-1637, ivyson1212@gmail.com</p>
                <p>- 문의 시간: 평일 10:00 ~ 17:00</p>
              </div>
            </section>

            <section>
              <h2 className="title3 mb-3 text-[var(--color-white)]">
                11. 개인정보처리방침의 변경
              </h2>
              <p>
                이 방침은 2025년 8월 1일부터 시행됩니다. 변경 시 개정 사유와
                내용을 사전 공지하며, 변경된 내용은 공지일로부터 7일
                후(이용자에게 불리한 경우 30일 후) 적용됩니다.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
