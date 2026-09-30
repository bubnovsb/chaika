(function(){
  window.SEAGULL_POLISH = function(code){
    const swap = (from, to) => { code = code.replace(from, to); };
    swap("const INK = '20,20,24';", "const INK = '20,20,24';\n  const musicPulse = (phase, strength) => { const m = window.SEAGULL_BEAT; if (!m || !m.on) return 1; const own = .55 + .45 * Math.sin(performance.now() * .0018 + phase); return 1 + clamp((m.level * .65 + m.bass * .25 + m.hit * .1) * own * strength, 0, .14); };");
    swap("const J = v => v + (hash(jn++) - .5) * 1.7 * S;", "const J = v => v + (hash(jn++) - .5) * 2.6 * S;");
    swap("const press = .55 + .45 * Math.sin(gg * Math.PI) + (hash(jn++) - .5) * .5;", "const press = .5 + .5 * Math.sin(gg * Math.PI) + (hash(jn++) - .5) * .72;");
    swap("const r = Math.max(.4, ww * .62 * press), ox = (hash(jn++) - .5) * ww * .35, oy = (hash(jn++) - .5) * ww * .35;", "const r = Math.max(.4, ww * .68 * press), ox = (hash(jn++) - .5) * ww * .52, oy = (hash(jn++) - .5) * ww * .52;");
    swap("if (hash(jn++) < .25) { const q = segs[Math.floor(hash(jn++) * segs.length)];", "if (hash(jn++) < .38) { const q = segs[Math.floor(hash(jn++) * segs.length)];");
    swap("for (let k = 0; k < 7; k++) { const y0 = bot - ry * rnd(.1, .9), dir = k % 2 ? 1 : -1; brushOn(g, [[cx + rnd(-8, 8) * S, y0], [cx + dir * rx * rnd(.3, .6), y0 - ry * rnd(.15, .45)], [cx + dir * rx * rnd(.6, .95), y0 - ry * rnd(.3, .7)]], rnd(1.6, 3), .8, .25); }", "for (let k = 0; k < 15; k++) { const y0 = bot - ry * rnd(.08, .94), dir = k % 2 ? 1 : -1; brushOn(g, [[cx + rnd(-7, 7) * S, y0], [cx + dir * rx * rnd(.28, .62), y0 - ry * rnd(.12, .48)], [cx + dir * rx * rnd(.62, 1.02), y0 - ry * rnd(.3, .74)]], rnd(2.2, 4.4), .92, .1); }");
    swap("const w0 = t.R * .2, n = 16;", "const w0 = t.R * .22;\n      for (let k = 0; k < 10; k++) { const u = k / 9 - .5, xb = cx + u * w0 * 2.5, xt = cx + u * w0; brushOn(g, [[xb, t.base + 5 * S], [cx + u * w0 * 1.5 + rnd(-2, 2) * S, bot], [xt + rnd(-3, 3) * S, bot - ry * .34]], rnd(6, 10), rnd(.26, .42), .035); }\n      const n = 28;");
    swap("brushOn(g, pts, rnd(2, 3.6), rnd(.7, .92), .18);", "brushOn(g, pts, rnd(2.6, 4.8), rnd(.82, .98), .07);");
    swap("const PAPER = '#FBFBF8';", "const PAPER = '#F5F1E8';");
    swap("function paper(pts){ ctx.fillStyle = PAPER; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); }", "function paper(pts){ ctx.save(); ctx.fillStyle = PAPER; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill(); ctx.clip(); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); ctx.fillStyle = 'rgba(' + INK + ',.055)'; const n = Math.min(12, Math.max(3, Math.round(((x1 - x0) + (y1 - y0)) / (24 * S)))); for (let k = 0; k < n; k++) { ctx.beginPath(); ctx.arc(rnd(x0, x1), rnd(y0, y1), rnd(.35, 1.1) * S, 0, TAU); ctx.fill(); } ctx.restore(); }");
    code = code.replace(/  function route\(from, to\)\{[\s\S]*?wps\.push\(to\); return wps;\n  \}/, [
      "  function treeBlocks(x, y, pad){ const T = L.tree, p = pad || 0, rx = T.R * .34 + p, cy = T.base - 18 * S, ry = Math.max(30 * S, T.trunk * .22) + p * .55, dx = (x - T.x) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy < 1; }",
      "  function aroundTree(from, to){",
      "    let hit = false; for (let k = 1; k < 28; k++) { const u = k / 28; if (treeBlocks(from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u, 38 * S)) { hit = true; break; } }",
      "    if (!hit) return [to];",
      "    const T = L.tree, b = walkBox(), side = T.R * .34 + 44 * S, y = Math.min(b.y1, T.base + 48 * S), left = [T.x - side, y], right = [T.x + side, y];",
      "    return from[0] <= T.x ? [left, right, to] : [right, left, to];",
      "  }",
      "  function route(from, to){",
      "    let crosses = false; for (let k = 1; k < 16; k++) { const u = k / 16; if (onWater(from[0] + (to[0] - from[0]) * u, from[1] + (to[1] - from[1]) * u, 1)) { crosses = true; break; } }",
      "    const base = []; if (crosses) { const y = shoreY() - 6 * S; if (from[1] > y) base.push([from[0], y]); if (to[1] > y) base.push([to[0], y]); } base.push(to);",
      "    const out = []; let start = from; for (const end of base) { const leg = aroundTree(start, end); out.push(...leg); start = end; } return out;",
      "  }"
    ].join('\n'));
    swap("if (p[1] < b.y0 || p[1] > b.y1 || onWater(p[0], p[1]) || Math.hypot(p[0] - man.x, p[1] - man.y) < 70 * S) continue;", "if (p[1] < b.y0 || p[1] > b.y1 || onWater(p[0], p[1]) || treeBlocks(p[0], p[1], 44 * S) || Math.hypot(p[0] - man.x, p[1] - man.y) < 70 * S) continue;");
    swap("const st = Math.min(d, speed * S * dt); e.x += dx / d * st; e.y += dy / d * st; e.moving = true;", "const ownRhythm = musicPulse(e === man ? .7 : 2.3, e === man ? .07 : .1), st = Math.min(d, speed * S * dt * ownRhythm); e.x += dx / d * st; e.y += dy / d * st; e.moving = true;");
    swap("const drawFigs = list => {\n      for (const e of list) e === man ? drawMan(man, t) : drawDog(dog, t);\n      if (leashed && list.length && (list.length === 2 || list[0] === man)) drawLeash();\n    };", "const drawFigs = list => {\n      if (leashed && list.length && (list.length === 2 || list[0] === man)) drawLeash();\n      for (const e of list) e === man ? drawMan(man, t) : drawDog(dog, t);\n    };");
    swap("b.x += (gx - b.x) * Math.min(1, dt * 1.4 * b.sp); b.y += (gy - b.y) * Math.min(1, dt * 1.4 * b.sp);", "b.x += (gx - b.x) * Math.min(1, dt * .9 * b.sp); b.y += (gy - b.y) * Math.min(1, dt * .9 * b.sp);");
    swap("const dx = F.goal[0] - F.x, dy = F.goal[1] - F.y, d = Math.hypot(dx, dy) || 1, sp = 110 * S;", "const dx = F.goal[0] - F.x, dy = F.goal[1] - F.y, d = Math.hypot(dx, dy) || 1, sp = 110 * S * musicPulse(.35, .1);");
    swap("const k = (minD - d) / d * .5; p.x -= dx * k; p.y -= dy * k; q.x += dx * k; q.y += dy * k;", "const k = Math.min(3 * S, (minD - d) * .18) / d; p.x -= dx * k; p.y -= dy * k; q.x += dx * k; q.y += dy * k;");
    swap("b.t -= dt; if (b.t > 0) { b.ph += dt * 11; b.x += Math.sin(t * 2 + b.ph) * 10 * S * dt; continue; }\n        const dx = b.px - b.x, dy = b.py - b.y, d = Math.hypot(dx, dy), st = Math.min(d, 150 * S * dt);\n        b.x += dx / d * st; b.y += dy / d * st; b.ph += dt * 11;\n        if (d < 2 * S) { b.st = 'sit'; b.x = b.px; b.y = b.py; }", "b.t -= dt;\n        const dx = b.px - b.x, dy = b.py - b.y, d = Math.max(.001, Math.hypot(dx, dy)), glide = b.t > 0 ? .22 : 1, st = Math.min(d, 150 * S * dt * glide);\n        b.x += dx / d * st + Math.sin(t * 1.7 + b.ph) * S * dt; b.y += dy / d * st; b.ph += dt * (b.t > 0 ? 7 : 11) * musicPulse(b.wx, .12);\n        if (b.t <= 0 && d < 2 * S) { b.st = 'sit'; b.x = b.px; b.y = b.py; }");
    code = code.split("b.ph += dt * 11 * b.sp;").join("b.ph += dt * 11 * b.sp * musicPulse(b.wx, .13);");
    code = code.split("b.ph += dt * 11;").join("b.ph += dt * 11 * musicPulse(b.wx, .11);");
    swap("man.ph += dt * 14;", "man.ph += dt * 14 * musicPulse(.7, .08);");
    swap("dog.ph += dt * 14;", "dog.ph += dt * 14 * musicPulse(2.3, .11);");
    const idleDpr = "dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;", dprAt = code.lastIndexOf(idleDpr);
    if (dprAt >= 0) code = code.slice(0, dprAt) + "dpr = Math.min(1.45, devicePixelRatio || 1); W = innerWidth; H = innerHeight;" + code.slice(dprAt + idleDpr.length);
    return code;
  };
})();
