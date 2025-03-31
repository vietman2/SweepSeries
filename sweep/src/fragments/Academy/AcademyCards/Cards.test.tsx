import { EmptyCard, NormalCard, ProCard } from "./Cards";
import { sampleAcademies } from "@testdata/products";
import { renderWithProviders } from "@utils/test-utils";

describe("<AcademyCards />", () => {
  it("should render EmptyCard", () => {
    renderWithProviders(<EmptyCard />);
  });

  it("should render NormalCard", () => {
    renderWithProviders(
      <>
        <NormalCard academy={sampleAcademies[0]} onPress={jest.fn()} />
        <NormalCard academy={sampleAcademies[0]} onPress={jest.fn()} type={2} />
      </>
    );
  });

  it("should render ProCard", () => {
    renderWithProviders(
      <>
        <ProCard academy={sampleAcademies[0]} onPress={jest.fn()} />
        <ProCard
          academy={{ ...sampleAcademies[0], num_requests: 0 }}
          onPress={jest.fn()}
          type={2}
        />
      </>
    );
  });
});
