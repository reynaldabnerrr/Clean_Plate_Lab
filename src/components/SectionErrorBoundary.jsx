import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * SectionErrorBoundary isolates runtime crashes to individual page sections
 * (e.g. macro calculator, interactive menu, order modal) so that an isolated
 * failure never crashes the entire website.
 */
export class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `[SectionErrorBoundary] Error in section "${this.props.sectionName || "unnamed"}":`,
      error,
      errorInfo,
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.hasError &&
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.handleReset();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === "function") {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="polite"
          className="mx-auto my-6 max-w-xl rounded-2xl border-2 border-[#1E1E1E] bg-[#FEFDF9] p-6 text-center shadow-[4px_4px_0_#1E1E1E]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5F4] text-[#C93B2B]">
            <AlertTriangle size={24} />
          </div>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B7860]">
            {this.props.sectionName || "Bagian ini sementara tidak tersedia"}
          </p>
          <h3 className="mt-1 font-display text-lg font-extrabold uppercase text-[#1E1E1E]">
            {this.props.title || "Terjadi kendala memuat bagian ini"}
          </h3>
          <p className="mt-1 text-xs text-[#6B7860]">
            {this.props.description ||
              "Layanan katering dan pemesanan WhatsApp tetap berjalan normal."}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#1E1E1E] px-4 py-2 font-mono text-xs font-bold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
