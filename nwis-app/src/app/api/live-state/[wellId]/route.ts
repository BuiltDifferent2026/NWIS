import { NextRequest, NextResponse } from 'next/server';
import { getAllWells, getRiskCorridorsForWell } from '@/lib/data/service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wellId: string }> }
) {
  try {
    const { wellId } = await params;
    const allWells = await getAllWells();
    const matchedWell = allWells.find(
      w => w.id.toLowerCase() === wellId.toLowerCase() ||
           w.name.toLowerCase().replace(/\s+/g, '-') === wellId.toLowerCase()
    );

    if (!matchedWell) {
      return NextResponse.json(
        { success: false, error: `Well '${wellId}' not found in registry` },
        { status: 404 }
      );
    }

    const corridors = await getRiskCorridorsForWell(matchedWell.id);
    const primaryCorridor = corridors[0] || null;

    const currentDepthMD = matchedWell.currentDepthMD || 2165.4;
    const currentDepthTVD = matchedWell.currentDepthTVD || 2130.2;
    const currentFormation = matchedWell.currentFormation || 'Upper Tipam Sandstone';

    // Calculate proximity lookahead metrics
    let lookaheadBufferM = 75.0;
    let distanceToTriggerM = 14.6;
    if (primaryCorridor) {
      const triggerDepth = primaryCorridor.depthInterval.from;
      distanceToTriggerM = Math.max(0, Math.round((triggerDepth - currentDepthMD) * 10) / 10);
      lookaheadBufferM = Math.max(0, Math.round((primaryCorridor.depthInterval.to - currentDepthMD) * 10) / 10);
    }

    const payload = {
      success: true,
      well_id: matchedWell.id,
      well_name: matchedWell.name,
      field: matchedWell.field,
      status: matchedWell.status === 'active' ? 'DRILLING' : matchedWell.status.toUpperCase(),
      rig: matchedWell.rig || 'OIL-E2000-IV',
      surface_coords: matchedWell.surfaceCoords,
      // ─── Narrow eRTMAC Read-Only Contract ───
      depth_md: currentDepthMD,
      depth_tvd: currentDepthTVD,
      formation: currentFormation,
      hole_section: '8-1/2 inch',
      mud_weight_ppg: 10.2,
      torque_kft_lb: 18.4,
      rop_m_hr: 14.8,
      wob_klbs: 22.5,
      flow_rate_gpm: 550,
      standpipe_pressure_psi: 3200,
      ecd_ppg: 10.4,
      ecd_limit_ppg: 10.6,
      timestamp: new Date().toISOString(),
      governance: {
        integration: 'eRTMAC v4.1 Bridge',
        access_mode: 'READ_ONLY',
        safety_boundary_enforced: true,
        zero_write_commands: true
      },
      lookahead: {
        active_hazard: primaryCorridor ? primaryCorridor.observedFactSummary : 'Upper Tipam Micro-fractures',
        lookahead_buffer_m: lookaheadBufferM,
        distance_to_trigger_m: distanceToTriggerM,
        trigger_depth_md: primaryCorridor ? primaryCorridor.depthInterval.from : 2180.0,
        estimated_time_to_trigger_hrs: Number((distanceToTriggerM / 14.8).toFixed(1)),
        recommended_lcm: '35 ppb multi-modal fiber blend (coarse CaCO3 + graphitic carbon)'
      }
    };

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal error retrieving eRTMAC live-state' },
      { status: 500 }
    );
  }
}
