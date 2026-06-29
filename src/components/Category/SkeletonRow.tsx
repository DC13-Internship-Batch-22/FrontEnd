const SkeletonRow = () => {
  return (
    <tr className="animate-pulse h-[53px]">
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-12" /></td>
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-32" /></td>
      <td className="px-5 py-3.5"><div className="h-3.5 bg-slate-200 rounded w-64" /></td>
      <td className="px-5 py-3.5">
        <div className="flex justify-end gap-1">
          <div className="h-7 w-7 bg-slate-200 rounded-lg" />
          <div className="h-7 w-7 bg-slate-200 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

export default SkeletonRow;
