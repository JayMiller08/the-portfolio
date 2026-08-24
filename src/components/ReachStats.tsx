import { Eye, Users, Clapperboard, Briefcase } from "lucide-react";
import { StatRow } from "./StatRow";

/** Start of the Zaio contract, per the contract itself. */
const ZAIO_START = new Date(2025, 10, 1); // November 2025

/**
 * Months on contract, counted inclusively from the start month.
 *
 * Derived rather than written down so the figure cannot go stale on a page
 * that is sent to recruiters months after it was last edited.
 */
const monthsOnContract = (now: Date = new Date()) => {
  const elapsed =
    (now.getFullYear() - ZAIO_START.getFullYear()) * 12 +
    (now.getMonth() - ZAIO_START.getMonth());
  return Math.max(1, elapsed + 1);
};

/**
 * Content reach. Rendered through the same StatRow as the GitHub figures so
 * the two carry equal weight.
 *
 * These numbers are self-reported. No verification badge or third-party
 * attribution is implied anywhere in this component.
 */
export const ReachStats = ({ className = "" }: { className?: string }) => {
  const items = [
    { icon: Eye, value: "1.7M+", label: "Views across both accounts, rolling 12 months" },
    { icon: Users, value: "15K+", label: "Combined followers" },
    { icon: Clapperboard, value: "2", label: "Accounts written, shot, edited and managed" },
    {
      icon: Briefcase,
      value: `${monthsOnContract()} mos`,
      label: "On contract with Zaio Institute of Technology",
    },
  ];

  return (
    <StatRow
      items={items}
      ariaLabel="Content reach"
      className={className}
      footnote="Figures are self-reported across both accounts over a rolling 12-month window."
    />
  );
};
