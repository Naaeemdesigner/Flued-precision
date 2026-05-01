import {
  ADDON_LABEL,
  PACKAGE_LABEL,
  VEHICLE_LABEL,
  type BookingPayloadT,
} from "./booking-schema";

const RED = "#E63946";
const SILVER = "#C0C0C0";
const BLACK = "#0A0A0A";
const CHARCOAL = "#121212";

/** Escape HTML to prevent injection from user-supplied fields. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(iso: string): string {
  try {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function renderBookingEmail(p: BookingPayloadT, ref: string): {
  subject: string;
  html: string;
  text: string;
} {
  const pkgLabel = PACKAGE_LABEL[p.packageId];
  const vehLabel = VEHICLE_LABEL[p.vehicleType];
  const addonRows = p.addons
    .map((id) => {
      const a = ADDON_LABEL[id];
      return `
        <tr>
          <td style="padding:8px 0;color:${SILVER};font-family:'Inter',sans-serif;font-size:14px;">${esc(a.label)}</td>
          <td style="padding:8px 0;color:${SILVER};font-family:'Inter',sans-serif;font-size:14px;text-align:right;">+$${a.price}</td>
        </tr>`;
    })
    .join("");

  const subject = `New Booking · ${esc(p.name)} · ${pkgLabel.split(" — ")[0]} · $${p.total}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BLACK};font-family:'Inter',Arial,sans-serif;color:${SILVER};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLACK};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:${CHARCOAL};border-radius:32px;border:1px solid rgba(192,192,192,0.15);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 16px 32px;border-bottom:1px solid rgba(192,192,192,0.1);">
              <p style="margin:0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${RED};">New Reservation</p>
              <h1 style="margin:8px 0 0 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#fff;">Fluid Precision</h1>
              <p style="margin:6px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:rgba(192,192,192,0.65);">Booking ref: ${esc(ref)}</p>
            </td>
          </tr>

          <!-- Customer -->
          <tr>
            <td style="padding:24px 32px;">
              <h2 style="margin:0 0 12px 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${RED};">Customer</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Name</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">${esc(p.name)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Email</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;"><a href="mailto:${esc(p.email)}" style="color:${RED};text-decoration:none;">${esc(p.email)}</a></td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Phone</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;"><a href="tel:${esc(p.phone.replace(/[^\d+]/g, ""))}" style="color:${RED};text-decoration:none;">${esc(p.phone)}</a></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Vehicle -->
          <tr>
            <td style="padding:0 32px 24px 32px;border-top:1px solid rgba(192,192,192,0.1);">
              <h2 style="margin:24px 0 12px 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${RED};">Vehicle</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Category</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">${esc(vehLabel)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Brand · Model</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">${esc(p.brand)} · ${esc(p.model)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Package -->
          <tr>
            <td style="padding:0 32px 24px 32px;border-top:1px solid rgba(192,192,192,0.1);">
              <h2 style="margin:24px 0 12px 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${RED};">Service</h2>
              <p style="margin:0 0 12px 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:3px;color:#fff;">${esc(pkgLabel)}</p>
              ${
                addonRows
                  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
                      <tr><td colspan="2" style="padding-bottom:6px;color:rgba(192,192,192,0.6);font-size:11px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Add-ons</td></tr>
                      ${addonRows}
                    </table>`
                  : `<p style="margin:0;color:rgba(192,192,192,0.5);font-style:italic;font-size:12px;font-family:'Inter',Arial,sans-serif;">No add-ons selected</p>`
              }
            </td>
          </tr>

          <!-- Schedule -->
          <tr>
            <td style="padding:0 32px 24px 32px;border-top:1px solid rgba(192,192,192,0.1);">
              <h2 style="margin:24px 0 12px 0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${RED};">Schedule & Location</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Date</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">${esc(fmtDate(p.date))}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Time</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">${esc(p.time)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:rgba(192,192,192,0.6);font-size:12px;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',Arial,sans-serif;">Duration (est)</td>
                  <td style="padding:6px 0;color:#fff;font-size:14px;text-align:right;font-family:'Inter',Arial,sans-serif;">~${p.duration.toFixed(1)} hrs</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:6px 0;color:#fff;font-size:14px;font-family:'Inter',Arial,sans-serif;">${esc(p.address)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Total -->
          <tr>
            <td style="padding:24px 32px;border-top:1px solid rgba(192,192,192,0.1);background:rgba(230,57,70,0.05);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Syncopate','Inter',Arial,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:${SILVER};">Estimated Total</td>
                  <td style="font-family:'Syncopate','Inter',Arial,sans-serif;font-size:32px;font-weight:700;color:${RED};text-align:right;">$${p.total}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;text-align:center;background:${BLACK};">
              <p style="margin:0;font-family:'Syncopate','Inter',Arial,sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(192,192,192,0.5);">Fluid Precision · Surgical Care for Automotive Assets</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `NEW RESERVATION — Fluid Precision
Ref: ${ref}

CUSTOMER
  Name:  ${p.name}
  Email: ${p.email}
  Phone: ${p.phone}

VEHICLE
  Category: ${vehLabel}
  Brand:    ${p.brand}
  Model:    ${p.model}

SERVICE
  Package: ${pkgLabel}
  Add-ons: ${
    p.addons.length
      ? p.addons.map((id) => `${ADDON_LABEL[id].label} (+$${ADDON_LABEL[id].price})`).join(", ")
      : "None"
  }

SCHEDULE
  Date:     ${fmtDate(p.date)}
  Time:     ${p.time}
  Duration: ~${p.duration.toFixed(1)} hrs
  Address:  ${p.address}

ESTIMATED TOTAL: $${p.total}
`;

  return { subject, html, text };
}
